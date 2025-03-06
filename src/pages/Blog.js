import { useContext, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FaSearch, FaCalendar, FaClock, FaStar, 
  FaEnvelope, FaEdit, FaTrash
} from 'react-icons/fa';
import BlogPost from '../components/BlogPost';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { blogService } from '../services/blogService';
import { supabase } from '../supabase/config';

// Keyframes
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const BlogContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const BlogHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  padding: 4rem 0;
  background: linear-gradient(135deg, var(--primary-color) 0%, #2a2a2a 100%);
  color: white;
  border-radius: 15px;
  margin-top: 2rem;
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--accent-color);
`;

const SearchContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 15px rgba(97, 218, 251, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 2rem 0;
  justify-content: center;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  background: ${props => props.$active ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.8)'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--accent-color);
    color: white;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.$active ? 'var(--accent-color)' : '#fff'};
  color: ${props => props.$active ? '#fff' : 'var(--primary-color)'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--accent-color);
    color: white;
  }
`;

const NewPostButton = styled(Link)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem;
  background: var(--accent-color);
  color: white;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 1.5rem;
  width: 60px;
  height: 60px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
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

function Blog() {
  const { user } = useContext(AuthContext) || { user: null };
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Add missing state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Define categories
  const categories = ['all', 'technology', 'lifestyle', 'programming', 'other'];

  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await blogService.getPosts();
        setPosts(data);
        // Calculate total pages based on posts length and items per page (e.g., 10 per page)
        setTotalPages(Math.ceil(data.length / 10));
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

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

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', postId);

        if (error) throw error;

        // Remove post from local state
        setPosts(posts.filter(post => post.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <BlogContainer>
      <BlogHeader>
        <HeaderTitle>Tech Blog</HeaderTitle>
        <p>Exploring the latest in web development and technology</p>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        <FiltersContainer>
          {categories.map(category => (
            <FilterButton
              key={category}
              $active={category === selectedCategory}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </FilterButton>
          ))}
        </FiltersContainer>
      </BlogHeader>

      <BlogGrid>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {currentPosts.map(post => (
              <BlogPost 
                key={post.id}
                post={post}
                isAdmin={user && user.email === 'thanhdz167@gmail.com'}
                onEdit={(id) => navigate(`/blog/editor/${id}`)}
                onDelete={handleDelete}
              />
            ))}
            {user && (
              <NewPostButton to="/blog/new" title="Create new post">
                +
              </NewPostButton>
            )}
          </>
        )}
      </BlogGrid>

      {totalPages > 1 && (
        <Pagination>
          {[...Array(totalPages)].map((_, index) => (
            <PageButton
              key={index + 1}
              $active={currentPage === index + 1}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </PageButton>
          ))}
        </Pagination>
      )}
    </BlogContainer>
  );
}

export default Blog; 