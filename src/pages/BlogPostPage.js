import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { FaCalendar, FaClock } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '../contexts/AuthContext';
import { blogService } from '../services/blogService';

const PageWrapper = styled.div`
  background-color: #1a1a1a;
  min-height: 100vh;
  margin: 0;
  padding: 2rem 1rem;
  padding-bottom: 6rem;
  position: relative;
`;

const PostContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #1E1E1E;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  color: #2ADFFF;
  margin-bottom: 1rem;
`;

const Meta = styled.div`
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Content = styled.div`
  color: #fff;
  line-height: 1.6;
  
  h1, h2, h3, h4, h5, h6 {
    color: #2ADFFF;
    margin: 1.5rem 0 1rem;
  }

  p {
    margin-bottom: 1rem;
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
  }

  pre {
    margin: 1rem 0;
    border-radius: 8px;
    overflow: hidden;
  }

  a {
    color: #2ADFFF;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 1rem 0;
  }

  blockquote {
    border-left: 4px solid #2ADFFF;
    margin: 1rem 0;
    padding-left: 1rem;
    color: #888;
  }

  ul, ol {
    margin: 1rem 0;
    padding-left: 2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  background: ${props => props.danger ? '#ff4444' : '#2ADFFF'};
  color: #1a1a1a;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.danger ? 'rgba(255, 68, 68, 0.2)' : 'rgba(42, 223, 255, 0.2)'};
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

const PostTitle = styled.h1`
  color: #2ADFFF;
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 700;
  
  text-shadow: 0 0 20px rgba(42, 223, 255, 0.2);
`;

const PostMeta = styled.div`
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

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #2ADFFF;
  }
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

const TagsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 3rem;
  padding-top: 2rem;
  justify-content: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Tag = styled.span`
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

function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isInitialized } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await blogService.deletePost(post.id);
      navigate('/blog');
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
      <PageWrapper>
        <PostContainer>
          <PostTitle>{post.title}</PostTitle>
          <PostMeta>
            <MetaItem>
              <FaCalendar />
              {formatDate(post.created_at)}
            </MetaItem>
            <MetaItem>
              <FaClock />
              {calculateReadTime(post.content)}
            </MetaItem>
          </PostMeta>
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
          {post.tags && post.tags.length > 0 && (
            <TagsContainer>
              {post.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagsContainer>
          )}
          {user && user.id === post.user_id && (
            <ButtonGroup>
              <Button onClick={handleEdit}>Edit Post</Button>
              <Button danger onClick={handleDelete}>Delete Post</Button>
            </ButtonGroup>
          )}
        </PostContainer>
      </PageWrapper>
    </>
  );
}

export default BlogPostPage;