import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { supabase } from '../supabase/config';

const EditorContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  min-height: calc(100vh - 100px);
  background: #1a1a1a;
  color: white;
`;

const EditorSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h2 {
    color: var(--accent-color);
    margin-bottom: 1rem;
  }
`;

const MetadataSection = styled.div`
  margin-bottom: 2rem;
  display: grid;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  background: #2a2a2a;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const TagInput = styled(Input)`
  width: auto;
  margin-right: 0.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 500px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  background: #2a2a2a;
  color: white;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const PreviewSection = styled.div`
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  background: #2a2a2a;
  overflow-y: auto;
  height: 100%;
  color: white;

  h1, h2, h3, h4, h5, h6 {
    color: var(--accent-color);
  }

  p {
    line-height: 1.6;
  }

  code {
    background: #1a1a1a;
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  background: rgba(97, 218, 251, 0.1);
  color: var(--accent-color);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0;
    font-size: 1rem;
  }
`;

const Label = styled.label`
  color: white;
  margin-bottom: 0.5rem;
  display: block;
`;

function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: [],
    date: new Date().toISOString().split('T')[0],
    readTime: '5 min read'
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching post with ID:', id);
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('Post not found');
        }

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
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag && !post.tags.includes(newTag)) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    try {
      if (id) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            tags: post.tags,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        if (error) throw error;
      } else {
        // Create new post
        const { error } = await supabase
          .from('posts')
          .insert([{
            ...post,
            slug: post.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
          }]);

        if (error) throw error;
      }

      navigate('/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <EditorContainer>
      <EditorSection>
        <h2>{id ? 'Edit Post' : 'Create New Post'}</h2>
        <MetadataSection>
          <div>
            <Label>Title:</Label>
            <Input
              type="text"
              name="title"
              value={post.title}
              onChange={handleChange}
              placeholder="Post title"
            />
          </div>
          <div>
            <Label>Excerpt:</Label>
            <Input
              type="text"
              name="excerpt"
              value={post.excerpt}
              onChange={handleChange}
              placeholder="Brief description"
            />
          </div>
          <div>
            <Label>Tags:</Label>
            <form onSubmit={handleAddTag}>
              <TagInput
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
              />
              <Button type="submit">Add Tag</Button>
            </form>
            <TagsContainer>
              {post.tags.map(tag => (
                <Tag key={tag}>
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)}>&times;</button>
                </Tag>
              ))}
            </TagsContainer>
          </div>
        </MetadataSection>
        <TextArea
          name="content"
          value={post.content}
          onChange={handleChange}
          placeholder="Write your post content in Markdown..."
        />
        <Button onClick={handleSave}>Save Post</Button>
      </EditorSection>
      
      <EditorSection>
        <h2>Preview</h2>
        <PreviewSection>
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
        </PreviewSection>
      </EditorSection>
    </EditorContainer>
  );
}

export default BlogEditor; 