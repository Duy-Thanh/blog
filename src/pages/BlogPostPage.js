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
  padding: clamp(1rem, 3vw, 2rem);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const PostContainer = styled(motion.article)`
  background: #1E1E1E;
  padding: clamp(1.5rem, 4vw, 3rem);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  max-width: 900px;
  width: 100%;
  
  @media screen and (max-width: 768px) {
    padding: clamp(1rem, 3vw, 1.5rem);
    border-radius: 8px;
  }
`;

const PostTitle = styled(motion.h1)`
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  color: #2ADFFF;
  text-align: center;
  font-weight: 700;
  line-height: 1.3;
`;

const PostMeta = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: clamp(1rem, 2vw, 1.5rem);
  color: #888;
  font-size: clamp(0.85rem, 2vw, 0.9rem);
  margin-bottom: clamp(1.5rem, 4vw, 2rem);
  flex-wrap: wrap;
  padding-bottom: clamp(1rem, 3vw, 1.5rem);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media screen and (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #2ADFFF;
  }
`;

const PostContent = styled(motion.div)`
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);

  h1, h2, h3, h4, h5, h6 {
    color: #2ADFFF;
    margin: clamp(1.5rem, 4vw, 2rem) 0 clamp(1rem, 2vw, 1.5rem);
    line-height: 1.4;
  }

  h1 { font-size: clamp(1.8rem, 4vw, 2.2rem); }
  h2 { font-size: clamp(1.6rem, 3.5vw, 1.9rem); }
  h3 { font-size: clamp(1.4rem, 3vw, 1.6rem); }

  p {
    margin-bottom: clamp(1rem, 3vw, 1.5rem);
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: clamp(1.5rem, 4vw, 2rem) 0;
  }

  pre {
    margin: clamp(1.5rem, 4vw, 2rem) 0;
    border-radius: 8px;
    overflow-x: auto;
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(0.85rem, 2vw, 0.9rem);
  }

  blockquote {
    border-left: 4px solid #2ADFFF;
    padding: clamp(1rem, 3vw, 1.5rem);
    margin: clamp(1.5rem, 4vw, 2rem) 0;
    background: rgba(42, 223, 255, 0.1);
    border-radius: 0 8px 8px 0;
    font-style: italic;
  }

  ul, ol {
    margin: clamp(1rem, 3vw, 1.5rem) 0;
    padding-left: clamp(1.5rem, 4vw, 2rem);
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: #2ADFFF;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      text-decoration: underline;
      opacity: 0.8;
    }
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: clamp(1rem, 2vw, 1.5rem);
  margin-top: clamp(2rem, 4vw, 3rem);
  justify-content: center;
  
  @media screen and (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: clamp(0.6rem, 2vw, 0.8rem) clamp(1rem, 3vw, 1.5rem);
  border: none;
  border-radius: 8px;
  background: ${props => props.danger ? '#ff4444' : '#2ADFFF'};
  color: ${props => props.danger ? '#fff' : '#1E1E1E'};
  font-size: clamp(0.9rem, 2vw, 1rem);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${props => props.danger ? 
      'rgba(255, 68, 68, 0.3)' : 
      'rgba(42, 223, 255, 0.3)'};
  }

  @media screen and (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 68, 68, 0.2);
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
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.6,
      ease: "easeOut"
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
        <PostContainer variants={contentVariants}>
          <PostTitle variants={contentVariants}>
            {post.title}
          </PostTitle>
          
          <PostMeta variants={contentVariants}>
            <MetaItem variants={contentVariants}>
              <FaCalendar />
              {formatDate(post.created_at)}
            </MetaItem>
            <MetaItem variants={contentVariants}>
              <FaClock />
              {calculateReadTime(post.content)}
            </MetaItem>
          </PostMeta>

          <motion.div
            variants={contentVariants}
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
            <TagsContainer variants={contentVariants}>
              <AnimatePresence>
                {post.tags.map((tag, index) => (
                  <Tag
                    key={index}
                    variants={contentVariants}
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
            <ButtonGroup variants={contentVariants}>
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