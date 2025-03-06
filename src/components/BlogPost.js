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
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const PostTitle = styled(Link)`
  color: var(--accent-color);
  text-decoration: none;
  font-size: 1.5rem;
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
  font-size: 0.9rem;
  margin-bottom: 1rem;
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
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

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
  return (
    <PostCard>
      <PostTitle to={`/blog/${post.slug}`}>{post.title}</PostTitle>
      <PostMeta>
        <MetaItem>
          <FaCalendar />
          {new Date(post.created_at).toLocaleDateString()}
        </MetaItem>
        <MetaItem>
          <FaClock />
          {post.readTime || '5 min read'}
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