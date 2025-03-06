import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { supabase } from '../supabase/config';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaCalendar, FaClock } from 'react-icons/fa';

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
  margin: 0 auto;
  padding: 3rem;
  background-color: #1E1E1E;
  border-radius: 20px;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  
  background-image: linear-gradient(
    to bottom right,
    rgba(42, 223, 255, 0.02),
    rgba(42, 223, 255, 0.001)
  );
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
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log('Fetching post with slug:', slug);
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Post not found');

        console.log('Fetched post:', data);
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
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
              {new Date(post.created_at).toLocaleDateString()}
            </MetaItem>
            <MetaItem>
              <FaClock />
              {getReadTime(post.content)}
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
        </PostContainer>
      </PageWrapper>
    </>
  );
}

export default BlogPostPage;