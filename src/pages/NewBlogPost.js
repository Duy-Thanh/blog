import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getSupabase } from '../supabase/config';
import { blogService } from '../services/blogService';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '../contexts/AuthContext';

const PageWrapper = styled.div`
  display: flex;
  gap: 2rem;
  max-width: 1600px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const EditorContainer = styled.div`
  flex: 1;
  padding: 2rem;
  background: #1E1E1E;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const PreviewContainer = styled.div`
  flex: 1;
  padding: 2rem;
  background: #1E1E1E;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
`;

const Title = styled.h1`
  color: #2ADFFF;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(42, 223, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #2ADFFF;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 400px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(42, 223, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  font-family: 'JetBrains Mono', monospace;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #2ADFFF;
  }
`;

const Button = styled.button`
  background: #2ADFFF;
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
    box-shadow: 0 4px 12px rgba(42, 223, 255, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const TagInput = styled(Input)`
  margin-bottom: 0.5rem;
`;

const TagsHelp = styled.p`
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const PreviewTitle = styled.h2`
  color: #2ADFFF;
  margin-bottom: 1rem;
`;

const MarkdownPreview = styled.div`
  color: #fff;
  line-height: 1.6;
  
  h1, h2, h3, h4 {
    color: #2ADFFF;
    margin: 1.5rem 0 1rem;
  }

  p {
    margin-bottom: 1rem;
  }

  code {
    background: rgba(42, 223, 255, 0.1);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    color: #2ADFFF;
  }

  pre {
    margin: 1rem 0;
    padding: 1rem;
    background: #1a1a1a;
    border-radius: 8px;
    overflow-x: auto;
  }
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #1E1E1E;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #888;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 68, 68, 0.2);
`;

function NewBlogPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a post');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const slug = generateSlug(title);
      const post = {
        title,
        content,
        slug,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await blogService.createPost(post);
      navigate('/blog');
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <EditorContainer>
        <Title>Create New Post</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="content">Content</Label>
            <TextArea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
            />
          </FormGroup>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Post'}
          </Button>
        </Form>
      </EditorContainer>

      <PreviewContainer>
        <PreviewTitle>Preview</PreviewTitle>
        <MarkdownPreview>
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
            {content}
          </ReactMarkdown>
        </MarkdownPreview>
      </PreviewContainer>
    </PageWrapper>
  );
}

export default NewBlogPost; 