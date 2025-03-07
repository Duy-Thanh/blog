import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import About from './pages/About';
import BlogPost from './components/BlogPost';
import BlogPostPage from './pages/BlogPostPage';
import BlogEditor from './pages/BlogEditor';
import Layout from './components/Layout';
import NewBlogPost from './pages/NewBlogPost';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router basename="/blog">
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/new-post" element={<NewBlogPost />} />
                <Route path="/blog/editor" element={<BlogEditor />} />
                <Route path="/blog/editor/:id" element={<BlogEditor />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/about" element={<About />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
