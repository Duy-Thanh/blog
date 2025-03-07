import { useContext, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
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
  padding: clamp(2rem, 6vw, 4rem) clamp(1rem, 3vw, 2rem);
  background: linear-gradient(135deg, var(--primary-color) 0%, #2a2a2a 100%);
  color: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    margin-bottom: clamp(0.5rem, 2vw, 1rem);
    background: linear-gradient(135deg, #2ADFFF 0%, #fff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: clamp(1rem, 2.5vw, 1.2rem);
    max-width: 600px;
    margin: 0 auto;
    opacity: 0.9;
  }

  @media screen and (max-width: 768px) {
    margin: 0.5rem 0;
    padding: clamp(1.5rem, 4vw, 2rem) clamp(0.5rem, 2vw, 1rem);
    border-radius: 8px;
  }
`;

const SearchContainer = styled.div`
  max-width: 600px;
  margin: clamp(1rem, 3vw, 1.5rem) auto;
  position: relative;
  padding: 0 clamp(0.5rem, 2vw, 1rem);
  width: 100%;

  @media screen and (max-width: 768px) {
    margin: 0.75rem auto;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 2.5rem;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 15px rgba(42, 223, 255, 0.1);
    outline: none;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #2ADFFF;
  font-size: 0.9rem;
`;

const BlogGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
  flex-grow: 1;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 1rem 0;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin: 1rem 0;
  justify-content: center;
  padding: 0 0.5rem;

  @media screen and (max-width: 480px) {
    gap: 0.25rem;
    margin: 0.5rem 0;
  }
`;

const FilterButton = styled(motion.button)`
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 20px;
  background: ${props => props.$active ? '#2ADFFF' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? '#1E1E1E' : '#fff'};
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  white-space: nowrap;

  &:hover {
    background: ${props => props.$active ? '#2ADFFF' : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-2px);
  }

  @media screen and (max-width: 480px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
  padding: 0.5rem;

  @media screen and (max-width: 480px) {
    gap: 0.25rem;
    margin: 1rem 0;
  }
`;

const PageButton = styled.button`
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.$active ? '#2ADFFF' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? '#1E1E1E' : '#fff'};
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 32px;

  &:hover {
    background: ${props => props.$active ? '#2ADFFF' : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-2px);
  }

  @media screen and (max-width: 480px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
`;

const NewPostButton = styled(Link)`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #2ADFFF;
  color: #1E1E1E;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 15px rgba(42, 223, 255, 0.3);
  transition: all 0.3s ease;
  z-index: 100;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(42, 223, 255, 0.4);
  }

  @media screen and (max-width: 480px) {
    bottom: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
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
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

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

  if (loading) {
    return <div>Loading blog posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <BlogContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <BlogHeader
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <HeaderTitle
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Tech Blog
        </HeaderTitle>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
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
          <AnimatePresence>
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <FilterButton
                  $active={category === selectedCategory}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </FilterButton>
              </motion.div>
            ))}
          </AnimatePresence>
        </FiltersContainer>
      </BlogHeader>

      <BlogGrid variants={containerVariants}>
        <AnimatePresence>
          {currentPosts.map((post, index) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
            >
              <BlogPost
                post={post}
                isAuthor={user?.id === post.author_id}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </BlogGrid>

      <Pagination>
        {Array.from({ length: totalPages }, (_, i) => (
          <PageButton
            key={i + 1}
            $active={currentPage === i + 1}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </PageButton>
        ))}
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