import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import swift from 'highlight.js/lib/languages/swift';
import kotlin from 'highlight.js/lib/languages/kotlin';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';
import shell from 'highlight.js/lib/languages/shell';
import powershell from 'highlight.js/lib/languages/powershell';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';
import html from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import markdown from 'highlight.js/lib/languages/markdown';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import ini from 'highlight.js/lib/languages/ini';
import 'highlight.js/styles/atom-one-dark.css';
import { useAuth } from '../contexts/AuthContext';
import { blogService } from '../services/blogService';

// Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('php', php);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('swift', swift);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('powershell', powershell);
hljs.registerLanguage('css', css);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('html', html);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('dockerfile', dockerfile);
hljs.registerLanguage('ini', ini);

const PageWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1rem, 3vw, 2rem);
  padding: clamp(1rem, 3vw, 2rem);
  max-width: 1600px;
  margin: 0 auto;
  
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const EditorContainer = styled.div`
  background: #1E1E1E;
  padding: clamp(1rem, 3vw, 2rem);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  @media screen and (max-width: 768px) {
    border-radius: 8px;
  }
`;

const PreviewContainer = styled.div`
  background: #1E1E1E;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 2rem;

  @media screen and (max-width: 1024px) {
    position: static;
  }

  @media screen and (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  color: #2ADFFF;
  margin-bottom: 2rem;
  font-size: clamp(1.5rem, 3vw, 2rem);
`;

const Input = styled.input`
  width: 100%;
  padding: clamp(0.6rem, 2vw, 0.8rem);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(42, 223, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: clamp(0.9rem, 2vw, 1rem);

  @media screen and (max-width: 768px) {
    padding: 0.6rem;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: clamp(200px, 50vh, 600px);
  padding: clamp(0.6rem, 2vw, 0.8rem);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(42, 223, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: clamp(0.9rem, 2vw, 1rem);
  font-family: 'JetBrains Mono', monospace;
  line-height: 1.6;
  resize: vertical;

  @media screen and (max-width: 768px) {
    min-height: 150px;
    padding: 0.6rem;
  }
`;

const Button = styled.button`
  background: #2ADFFF;
  color: #1a1a1a;
  padding: clamp(0.6rem, 2vw, 1rem) clamp(1.2rem, 4vw, 2rem);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: clamp(0.875rem, 2vw, 1rem);

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 0.8rem;
    font-size: 0.9rem;
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
  margin-bottom: 1.5rem;

  @media screen and (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const Label = styled.label`
  color: #888;
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 68, 68, 0.2);
  font-size: clamp(0.875rem, 2vw, 1rem);

  @media screen and (max-width: 768px) {
    padding: 0.75rem;
    margin-bottom: 0.75rem;
  }
`;

function NewBlogPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, isInitialized } = useAuth();

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isInitialized) {
      setError('Please wait for initialization');
      return;
    }

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

  const renderPreview = (content) => {
    return content.split(/(```[\s\S]*?```)/g).map((part, index) => {
      if (part.startsWith('```')) {
        const [firstLine, ...rest] = part.slice(3, -3).split('\n');
        const code = rest.join('\n');
        const language = firstLine.trim();
        
        let highlightedCode;
        try {
          highlightedCode = language && hljs.getLanguage(language)
            ? hljs.highlight(code, { language }).value
            : hljs.highlightAuto(code).value;
        } catch (err) {
          highlightedCode = code; // Fallback to plain text
          console.warn('Language not supported:', language);
        }
        
        return (
          <pre key={index}>
            <code 
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
              className={`hljs ${language ? `language-${language}` : ''}`}
            />
          </pre>
        );
      }
      return <ReactMarkdown key={index}>{part}</ReactMarkdown>;
    });
  };

  if (!isInitialized) {
    return <div>Initializing...</div>;
  }

  if (!user) {
    return <div>Please log in to create a post</div>;
  }

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
          {renderPreview(content)}
        </MarkdownPreview>
      </PreviewContainer>
    </PageWrapper>
  );
}

export default NewBlogPost; 