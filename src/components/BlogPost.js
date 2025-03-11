import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaCalendar, FaClock, FaEdit, FaTrash, FaTags } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PostCard = styled(motion.div)`
  background: var(--card-background);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: var(--transition-normal);
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--accent-color), #1fb8d4);
    opacity: 0;
    transition: var(--transition-normal);
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--box-shadow);
    border-color: rgba(42, 223, 255, 0.2);
    
    &::before {
      opacity: 1;
    }
  }

  @media screen and (max-width: 768px) {
    padding: var(--spacing-sm);
  }
`;

const PostContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PostTitle = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  font-size: clamp(1.3rem, 3vw, 1.6rem);
  font-weight: 600;
  display: block;
  margin-bottom: var(--spacing-sm);
  line-height: 1.4;
  transition: var(--transition-normal);
  
  &:hover {
    color: var(--accent-color);
    transform: translateX(5px);
  }
`;

const PostMeta = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  margin-bottom: var(--spacing-sm);
  flex-wrap: wrap;
  align-items: center;
  
  @media screen and (max-width: 480px) {
    gap: var(--spacing-xs);
  }
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.6rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  transition: var(--transition-normal);
  
  svg {
    color: var(--accent-color);
    font-size: 0.9em;
  }
  
  &:hover {
    background: rgba(42, 223, 255, 0.1);
  }
`;

const PostExcerpt = styled.p`
  color: var(--text-secondary);
  font-size: clamp(0.9rem, 2vw, 1rem);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
  flex: 1;
  
  @media screen and (max-width: 768px) {
    margin-bottom: var(--spacing-sm);
  }
`;

const Tags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: var(--spacing-md);
`;

const Tag = styled.span`
  background: rgba(42, 223, 255, 0.1);
  color: var(--accent-color);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  transition: var(--transition-normal);
  
  &:hover {
    background: rgba(42, 223, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const ActionButtons = styled(motion.div)`
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-color);
  
  @media screen and (max-width: 480px) {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: var(--transition-normal);
  width: auto;

  @media screen and (max-width: 480px) {
    width: 100%;
  }

  &.edit {
    background: var(--accent-color);
    color: var(--primary-color);
    
    &:hover {
      background: #1fb8d4;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(42, 223, 255, 0.2);
    }
  }

  &.delete {
    background: rgba(255, 68, 68, 0.1);
    color: #ff4444;
    
    &:hover {
      background: #ff4444;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 68, 68, 0.2);
    }
  }
`;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

function BlogPost({ post, onEdit, onDelete, isAdmin }) {
  // Calculate read time based on content length
  const calculateReadTime = (content) => {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  // Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <PostCard
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
    >
      <PostContent>
        <PostTitle to={`/blog/${post.slug}`}>{post.title}</PostTitle>
        <PostMeta>
          <MetaItem>
            <FaCalendar />
            {formatDate(post.created_at)}
          </MetaItem>
          <MetaItem>
            <FaClock />
            {calculateReadTime(post.content)}
          </MetaItem>
          {post.tags && post.tags.length > 0 && (
            <MetaItem>
              <FaTags />
              {post.tags.length} tags
            </MetaItem>
          )}
        </PostMeta>
        
        {post.tags && post.tags.length > 0 && (
          <Tags>
            {post.tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </Tags>
        )}
        
        <PostExcerpt>{post.excerpt}</PostExcerpt>
      </PostContent>
      
      {isAdmin && (
        <ActionButtons
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ActionButton 
            className="edit"
            onClick={() => onEdit(post.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaEdit /> Edit
          </ActionButton>
          <ActionButton 
            className="delete"
            onClick={() => onDelete(post.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTrash /> Delete
          </ActionButton>
        </ActionButtons>
      )}
    </PostCard>
  );
}

export default BlogPost;