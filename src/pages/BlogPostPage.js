import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaCalendar, FaClock, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { blogService } from '../services/blogService';
import ConfirmModal from '../components/ConfirmModal';

const PageWrapper = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PostContainer = styled(motion.article)`
  background: #1E1E1E;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2ADFFF, #FF69B4, #2ADFFF);
    background-size: 200% 100%;
    animation: gradient 3s linear infinite;
  }

  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const PostTitle = styled(motion.h1)`
  color: #2ADFFF;
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 700;
  text-shadow: 0 0 20px rgba(42, 223, 255, 0.2);
`;

const PostMeta = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 2rem;
  color: #888;
  font-size: 1rem;
  margin-bottom: 3rem;
  align-items: center;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const MetaItem = styled(motion.span)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #2ADFFF;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
`;

const Button = styled(motion.button)`
  background: ${props => props.danger ? '#ff4444' : '#2ADFFF'};
  color: #1a1a1a;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 68, 68, 0.2);
`;

const PostContent = styled.div`
  color: #FFFFFF;
  line-height: 1.8;
  font-size: 1.1rem;
  
  h1, h2, h3, h4 {
    color: #2ADFFF !important; // Force the color to override markdown styles
    margin: 2.5rem 0 1.5rem;
    font-weight: 600;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.75rem;
  }

  p {
    margin-bottom: 1.5rem;
    color: #FFFFFF;
    line-height: 1.9;
  }

  a {
    color: #2ADFFF;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.3s ease;
    
    &:hover {
      border-bottom-color: #2ADFFF;
    }
  }

  ul, ol {
    margin: 1.5rem 0;
    padding-left: 2rem;
    color: #FFFFFF;
  }

  li {
    margin-bottom: 0.5rem;
    color: #FFFFFF;
  }

  blockquote {
    margin: 2rem 0;
    padding: 1rem 2rem;
    border-left: 4px solid #2ADFFF;
    background: rgba(42, 223, 255, 0.05);
    font-style: italic;
    color: #FFFFFF;
  }

  strong, em {
    color: #FFFFFF;
  }

  pre {
    margin: 2rem 0;
    border-radius: 12px;
    background: #1a1a1a !important;
    padding: 1.5rem !important;
    overflow-x: auto;
    border: 1px solid rgba(42, 223, 255, 0.2);
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.2),
      inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  }

  code {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    background: rgba(42, 223, 255, 0.1);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-size: 0.9em;
    color: #2ADFFF;
  }

  /* Style the syntax highlighting */
  .token.keyword {
    color: #ff79c6;
  }

  .token.function {
    color: #50fa7b;
  }

  .token.string {
    color: #f1fa8c;
  }

  .token.comment {
    color: #6272a4;
  }

  .token.operator {
    color: #ff79c6;
  }

  .token.punctuation {
    color: #f8f8f2;
  }

  /* Add a subtle gradient to code blocks */
  .syntax-highlighter {
    background: linear-gradient(
      to bottom right,
      rgba(40, 42, 54, 0.8),
      rgba(40, 42, 54, 0.9)
    ) !important;
  }

  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 2rem 0;
  }

  hr {
    margin: 3rem 0;
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const TagsContainer = styled(motion.div)`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 3rem;
  padding-top: 2rem;
  justify-content: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Tag = styled(motion.span)`
  background: rgba(42, 223, 255, 0.1);
  color: #2ADFFF;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(42, 223, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #1a1a1a;
    min-height: 100vh;
  }

  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap');
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 100
    }
  }
};

function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isInitialized } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!isInitialized) return;
      
      try {
        console.log('Fetching post with slug:', slug);
        const data = await blogService.getPostBySlug(slug);
        if (data) {
          setPost(data);
        } else {
          setError('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug, isInitialized]);

  const handleEdit = () => {
    navigate(`/blog/editor/${post.id}`);
  };

  const handleDelete = async () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await blogService.deletePost(post.id);
      setIsDeleteModalOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError(error.message);
    }
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <PageWrapper><div>Loading...</div></PageWrapper>;
  if (error) return <PageWrapper><div>Error: {error}</div></PageWrapper>;
  if (!post) return <PageWrapper><div>Post not found</div></PageWrapper>;

  return (
    <>
      <GlobalStyle />
      <PageWrapper
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <PostContainer variants={itemVariants}>
          <PostTitle variants={itemVariants}>
            {post.title}
          </PostTitle>
          
          <PostMeta variants={itemVariants}>
            <MetaItem variants={itemVariants}>
              <FaCalendar />
              {formatDate(post.created_at)}
            </MetaItem>
            <MetaItem variants={itemVariants}>
              <FaClock />
              {calculateReadTime(post.content)}
            </MetaItem>
          </PostMeta>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <PostContent>
              <ReactMarkdown
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {post.content}
              </ReactMarkdown>
            </PostContent>
          </motion.div>

          {post.tags && post.tags.length > 0 && (
            <TagsContainer variants={itemVariants}>
              <AnimatePresence>
                {post.tags.map((tag, index) => (
                  <Tag
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tag}
                  </Tag>
                ))}
              </AnimatePresence>
            </TagsContainer>
          )}

          {user && user.id === post.user_id && (
            <ButtonGroup variants={itemVariants}>
              <Button
                onClick={handleEdit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEdit /> Edit Post
              </Button>
              <Button
                danger
                onClick={handleDelete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTrash /> Delete Post
              </Button>
            </ButtonGroup>
          )}
        </PostContainer>
      </PageWrapper>
      
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </>
  );
}

export default BlogPostPage;