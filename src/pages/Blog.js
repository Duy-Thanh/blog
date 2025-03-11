import { useContext, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaCalendar, FaClock, FaStar, 
  FaEnvelope, FaEdit, FaTrash
} from 'react-icons/fa';
import BlogPost from '../components/BlogPost';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { blogService } from '../services/blogService';
import { useAuth } from '../contexts/AuthContext';

// Enhanced animations
const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.5; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shineAnimation = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const BlogContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 2rem);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const BlogHeader = styled(motion.div)`
  text-align: center;
  margin: clamp(1rem, 4vw, 2rem) 0;
  padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 3vw, 2rem);
  background: linear-gradient(135deg, 
    rgba(26, 26, 26, 0.97) 0%,
    rgba(42, 42, 42, 0.97) 100%
  );
  color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow);
  position: relative;
  overflow: hidden;
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(42, 223, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(42, 223, 255, 0.15) 0%, transparent 50%);
    z-index: -1;
    opacity: 0.8;
    animation: ${pulseAnimation} 8s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(42, 223, 255, 0.5),
      transparent
    );
  }

  h1 {
    font-size: clamp(2.5rem, 6vw, 4rem);
    margin-bottom: clamp(0.5rem, 2vw, 1rem);
    background: linear-gradient(135deg, #2ADFFF 0%, #fff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 30px rgba(42, 223, 255, 0.3);
    letter-spacing: -1px;
    font-weight: 800;
  }

  p {
    font-size: clamp(1.1rem, 2.5vw, 1.3rem);
    max-width: 600px;
    margin: 0 auto;
    opacity: 0.9;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
  }

  @media screen and (max-width: 768px) {
    margin: 0.5rem 0;
    padding: clamp(1.5rem, 4vw, 2rem) clamp(0.5rem, 2vw, 1rem);
    border-radius: 8px;
  }
`;

const SearchContainer = styled.div`
  max-width: 600px;
  margin: clamp(2rem, 5vw, 3rem) auto 0;
  position: relative;
  width: 90%;
  
  &::after {
    content: '';
    position: absolute;
    inset: -5px;
    border-radius: 35px;
    background: linear-gradient(135deg, 
      rgba(42, 223, 255, 0.2),
      rgba(255, 255, 255, 0.1)
    );
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:focus-within::after {
    opacity: 1;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.2rem 3.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: clamp(1rem, 2vw, 1.1rem);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(42, 223, 255, 0.5);
    box-shadow: 0 0 25px rgba(42, 223, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--accent-color);
  font-size: 1rem;
  pointer-events: none;
`;

const BlogGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: clamp(1rem, 3vw, 1.5rem);
  margin: clamp(2rem, 4vw, 3rem) 0;
  padding: 0 clamp(1rem, 3vw, 2rem);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin: clamp(1.5rem, 4vw, 2rem) auto;
  justify-content: center;
  max-width: 800px;
  padding: 0 1rem;
`;

const FilterButton = styled(motion.button)`
  padding: 0.7rem 1.4rem;
  border: none;
  border-radius: 25px;
  background: ${props => props.$active ? 
    'linear-gradient(135deg, var(--accent-color) 0%, #1fb8d4 100%)' : 
    'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.$active ? '#1a1a1a' : 'rgba(255, 255, 255, 0.8)'};
  font-size: 0.95rem;
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.$active ? 
    'transparent' : 
    'rgba(255, 255, 255, 0.1)'};
  box-shadow: ${props => props.$active ?
    '0 8px 20px rgba(42, 223, 255, 0.2)' :
    'none'};

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.$active ?
      'linear-gradient(135deg, var(--accent-color) 0%, #1fb8d4 100%)' :
      'rgba(255, 255, 255, 0.1)'};
    box-shadow: 0 8px 20px rgba(42, 223, 255, 0.15);
  }
`;

const Pagination = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
  padding: 1rem;
  flex-wrap: wrap;
  
  &::before, &::after {
    content: '';
    height: 1px;
    flex: 1;
    max-width: 100px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(42, 223, 255, 0.3),
      transparent
    );
  }
`;

const PageButton = styled(motion.button)`
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 12px;
  background: ${props => props.$active ? 
    'linear-gradient(135deg, var(--accent-color) 0%, #1fb8d4 100%)' : 
    'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.$active ? '#1a1a1a' : 'rgba(255, 255, 255, 0.8)'};
  font-size: 0.95rem;
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 45px;
  position: relative;
  overflow: hidden;

  ${props => props.$active && css`
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 200%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      animation: ${shineAnimation} 2s linear infinite;
    }
  `}

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.$active ?
      'linear-gradient(135deg, var(--accent-color) 0%, #1fb8d4 100%)' :
      'rgba(255, 255, 255, 0.1)'};
    box-shadow: 0 4px 15px rgba(42, 223, 255, 0.15);
  }
`;

const NewPostButton = styled(motion(Link))`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background: linear-gradient(135deg, var(--accent-color) 0%, #1fb8d4 100%);
  color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 20px rgba(42, 223, 255, 0.3);
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  z-index: 100;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 32px;
    background: linear-gradient(135deg, 
      rgba(42, 223, 255, 0.5),
      rgba(31, 184, 212, 0.5)
    );
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(42, 223, 255, 0.4);
  }
`;

const HeaderTitle = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: clamp(0.5rem, 2vw, 1rem);
  background: linear-gradient(135deg, #2ADFFF 0%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  text-shadow: 0 0 20px rgba(42, 223, 255, 0.2);

  @media screen and (max-width: 768px) {
    font-size: clamp(1.5rem, 4vw, 2rem);
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: clamp(3rem, 8vw, 6rem);
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--border-radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.05);
  grid-column: 1 / -1;

  h3 {
    font-size: clamp(1.3rem, 3vw, 1.6rem);
    margin-bottom: 1rem;
    color: var(--accent-color);
    font-weight: 600;
  }

  p {
    font-size: clamp(0.95rem, 2vw, 1.1rem);
    max-width: 400px;
    margin: 0 auto;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.6);
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
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
      duration: 0.5
    }
  }
};

const LoadingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 2rem;
`;

const LoadingSpinner = styled(motion.div)`
  width: 60px;
  height: 60px;
  border: 3px solid rgba(42, 223, 255, 0.1);
  border-top: 3px solid var(--accent-color);
  border-radius: 50%;
`;

const LoadingText = styled(motion.p)`
  color: var(--accent-color);
  font-size: 1.2rem;
  font-weight: 500;
  text-align: center;
  
  span {
    display: inline-block;
    margin-left: 4px;
    opacity: 0.7;
  }
`;

const ErrorContainer = styled(motion.div)`
  text-align: center;
  padding: 3rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: var(--border-radius-lg);
  border: 1px solid rgba(255, 68, 68, 0.2);
  margin: 2rem auto;
  max-width: 600px;

  h3 {
    color: #ff4444;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 1.5rem;
  }

  button {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: var(--border-radius-sm);
    background: #ff4444;
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 68, 68, 0.3);
    }
  }
`;

function Blog() {
  const { user, isInitialized } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Define categories
  const categories = ['all', 'technology', 'lifestyle', 'programming', 'other'];

  const navigate = useNavigate();

  // Calculate read time for excerpt preview
  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
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

  // Update the posts data with calculated read time
  useEffect(() => {
    const loadPosts = async () => {
      if (!isInitialized) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await blogService.getPosts();
        
        // Add calculated read time to each post
        const postsWithReadTime = data.map(post => ({
          ...post,
          readTime: calculateReadTime(post.content),
          formattedDate: formatDate(post.created_at)
        }));
        
        setPosts(postsWithReadTime);
        setTotalPages(Math.ceil(data.length / 10));
      } catch (error) {
        console.error('Error loading posts:', error);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [isInitialized]);

  // Filter posts based on search and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const postsPerPage = 10;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Add these handler functions
  const handleEdit = (postId) => {
    navigate(`/blog/editor/${postId}`);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await blogService.deletePost(postId);
        // Remove the deleted post from the state
        setPosts(posts.filter(post => post.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <LoadingContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <LoadingSpinner
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <LoadingText
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading blog posts<span>...</span>
        </LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </ErrorContainer>
    );
  }

  return (
    <BlogContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <BlogHeader variants={itemVariants}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Tech Blog
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Exploring the latest in web development and technology
        </motion.p>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <FiltersContainer>
          {categories.map((category, index) => (
            <FilterButton
              key={category}
              $active={category === selectedCategory}
              onClick={() => setSelectedCategory(category)}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </FilterButton>
          ))}
        </FiltersContainer>
      </BlogHeader>

      <BlogGrid variants={containerVariants}>
        {currentPosts.length > 0 ? (
          currentPosts.map((post, index) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <BlogPost
                post={post}
                isAdmin={user?.id === post.author_id}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))
        ) : (
          <EmptyState variants={itemVariants}>
            <h3>No posts found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
          </EmptyState>
        )}
      </BlogGrid>

      <Pagination
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {currentPage > 1 && (
          <PageButton
            onClick={() => setCurrentPage(prev => prev - 1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ←
          </PageButton>
        )}
        
        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          // Show first page, last page, current page, and pages around current page
          if (
            pageNum === 1 ||
            pageNum === totalPages ||
            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
          ) {
            return (
              <PageButton
                key={pageNum}
                $active={currentPage === pageNum}
                onClick={() => setCurrentPage(pageNum)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {pageNum}
              </PageButton>
            );
          } else if (
            pageNum === currentPage - 2 ||
            pageNum === currentPage + 2
          ) {
            return <span key={pageNum}>...</span>;
          }
          return null;
        })}
        
        {currentPage < totalPages && (
          <PageButton
            onClick={() => setCurrentPage(prev => prev + 1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            →
          </PageButton>
        )}
      </Pagination>

      {user && (
        <NewPostButton
          to="new-post"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaEdit />
        </NewPostButton>
      )}
    </BlogContainer>
  );
}

export default Blog; 