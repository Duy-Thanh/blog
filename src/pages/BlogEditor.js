import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '../contexts/AuthContext';
import { blogService } from '../services/blogService';

const PageWrapper = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1600px;
  margin: 2rem auto;
  padding: 0 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const EditorContainer = styled(motion.div)`
  background: #1E1E1E;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const PreviewContainer = styled(motion.div)`
  background: #1E1E1E;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled(motion.h1)`
  color: #2ADFFF;
  margin-bottom: 2rem;
`;

const PreviewTitle = styled.h2`
  color: #2ADFFF;
  margin-bottom: 2rem;
`;

const Form = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #888;
  font-size: 0.9rem;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(42, 223, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2ADFFF;
    box-shadow: 0 0 10px rgba(42, 223, 255, 0.2);
  }
`;

const TextArea = styled(motion.textarea)`
  width: 100%;
  height: 400px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(42, 223, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  font-family: 'JetBrains Mono', monospace;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2ADFFF;
    box-shadow: 0 0 10px rgba(42, 223, 255, 0.2);
  }
`;

const Button = styled(motion.button)`
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

const ErrorMessage = styled.div`
  color: #ff4444;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 68, 68, 0.2);
`;

const MarkdownPreview = styled.div`
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
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
      ease: "easeOut"
    }
  }
};

function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isInitialized } = useAuth();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!isInitialized) return;
      
      try {
        console.log('Fetching post with ID:', id);
        const data = await blogService.getPost(id);
        if (data) {
          setPost(data);
          setTitle(data.title);
          setContent(data.content);
          setExcerpt(data.excerpt || '');
          setTags(data.tags?.join(', ') || '');
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

    if (id) {
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [id, isInitialized]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to edit a post');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const updates = {
        title,
        content,
        excerpt,
        tags: tagArray,
        updated_at: new Date().toISOString()
      };

      await blogService.updatePost(id, updates);
      navigate('/blog');
    } catch (error) {
      console.error('Error updating post:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!post) return <div>Post not found</div>;

  return (
    <PageWrapper
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <EditorContainer variants={itemVariants}>
        <Title variants={itemVariants}>Edit Post</Title>
        {error && <ErrorMessage variants={itemVariants}>{error}</ErrorMessage>}
        <Form onSubmit={handleSubmit}>
          <FormGroup variants={itemVariants}>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              whileFocus={{ scale: 1.01 }}
            />
          </FormGroup>
          <FormGroup variants={itemVariants}>
            <Label htmlFor="excerpt">Excerpt</Label>
            <TextArea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
              rows={3}
              placeholder="Brief description of your post..."
              whileFocus={{ scale: 1.01 }}
            />
          </FormGroup>
          <FormGroup variants={itemVariants}>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tech, programming, web development"
              whileFocus={{ scale: 1.01 }}
            />
          </FormGroup>
          <FormGroup variants={itemVariants}>
            <Label htmlFor="content">Content (Markdown supported)</Label>
            <TextArea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={15}
              placeholder="Write your post content here..."
              whileFocus={{ scale: 1.01 }}
            />
          </FormGroup>
          <Button
            type="submit"
            disabled={saving}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Form>
      </EditorContainer>

      <PreviewContainer variants={itemVariants}>
        <Title variants={itemVariants}>Preview</Title>
        <MarkdownPreview>
          <h1>{title}</h1>
          <p><em>{excerpt}</em></p>
          {tags && (
            <p>
              Tags: {tags.split(',').map(tag => tag.trim()).join(', ')}
            </p>
          )}
          <hr />
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

export default BlogEditor; 