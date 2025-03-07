import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaCalendar, FaClock, FaEdit, FaTrash } from 'react-icons/fa';

const PostCard = styled.div`
  background: #1E1E1E;
  border-radius: 15px;
  padding: 1.5rem;
  transition: transform 0.3s ease;
  position: relative;
  
  @media screen and (max-width: 768px) {
    padding: 1rem;
  }

  &:hover {
    transform: translateY(-5px);
  }
`;

const PostTitle = styled(Link)`
  color: var(--accent-color);
  text-decoration: none;
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  display: block;
  margin-bottom: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PostMeta = styled.div`
  display: flex;
  gap: 1rem;
  color: #888;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  margin-bottom: 1rem;
  flex-wrap: wrap;
  
  @media screen and (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PostExcerpt = styled.p`
  color: #ccc;
  margin-bottom: 1.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  @media screen and (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  transition: all 0.3s ease;
  width: auto;

  @media screen and (max-width: 480px) {
    width: 100%;
  }

  &.edit {
    background: var(--accent-color);
    color: white;
  }

  &.delete {
    background: #ff4444;
    color: white;
  }

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;

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
    <PostCard>
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
      </PostMeta>
      <PostExcerpt>{post.excerpt}</PostExcerpt>
      
      {isAdmin && (
        <ActionButtons>
          <ActionButton 
            className="edit"
            onClick={() => onEdit(post.id)}
          >
            <FaEdit /> Edit
          </ActionButton>
          <ActionButton 
            className="delete"
            onClick={() => onDelete(post.id)}
          >
            <FaTrash /> Delete
          </ActionButton>
        </ActionButtons>
      )}
    </PostCard>
  );
}

export default BlogPost;