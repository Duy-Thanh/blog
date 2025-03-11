import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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

const EditorContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Editor = styled.textarea`
  width: 100%;
  min-height: 500px;
  padding: 1rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  background: #1E1E1E;
  color: #abb2bf;
  border: 1px solid #333;
  border-radius: 8px;
  resize: vertical;
`;

const Preview = styled.div`
  padding: 1rem;
  background: #1E1E1E;
  border-radius: 8px;
  border: 1px solid #333;
  
  pre {
    margin: 1rem 0;
    padding: 1rem;
    background: #282c34;
    border-radius: 4px;
    overflow-x: auto;
    
    code {
      font-family: 'Fira Code', monospace;
      font-size: 0.9rem;
      line-height: 1.5;
    }
  }
`;

function BlogEditor() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      const post = await blogService.getPost(id);
      if (post) {
        setTitle(post.title);
        setContent(post.content);
      }
    } catch (error) {
      console.error('Error loading post:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (id) {
        await blogService.updatePost(id, { title, content });
      } else {
        await blogService.createPost({ title, content });
      }
      navigate('/blog');
    } catch (error) {
      console.error('Error saving post:', error);
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

  if (!user) {
    return <div>Please log in to edit posts.</div>;
  }

  return (
    <EditorContainer>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <Editor
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content here..."
        />
        <button onClick={handleSave} style={{ marginTop: '1rem' }}>
          Save Post
        </button>
      </div>
      <Preview>
        <h1>{title}</h1>
        {renderPreview(content)}
      </Preview>
    </EditorContainer>
  );
}

export default BlogEditor; 