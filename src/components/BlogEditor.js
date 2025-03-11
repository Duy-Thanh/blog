import React from 'react';
import styled from 'styled-components';

// ... other imports and styled components ...

const PreviewCodeWrapper = styled.div`
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  background: #282c34;
  
  pre {
    margin: 0 !important;
    padding: 1rem;
    overflow-x: auto;
    
    code {
      font-family: 'Fira Code', monospace;
      font-size: 0.9rem;
      line-height: 1.5;
      color: #abb2bf;
    }
  }
`;

const BlogEditor = () => {
  // ... existing state and handlers ...

  const renderPreview = (content) => {
    return content.split(/(```[\s\S]*?```)/g).map((part, index) => {
      if (part.startsWith('```')) {
        const [firstLine, ...rest] = part.slice(3, -3).split('\n');
        const code = rest.join('\n');
        
        return (
          <PreviewCodeWrapper key={index}>
            <pre>
              <code>{code}</code>
            </pre>
          </PreviewCodeWrapper>
        );
      }
      return <div key={index}>{part}</div>;
    });
  };

  // ... rest of the component ...
};

export default BlogEditor; 