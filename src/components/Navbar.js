import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Login } from './Login';
import { supabase } from '../supabase/config';

const Nav = styled.nav`
  background: var(--primary-color);
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 clamp(1rem, 3vw, 2rem);
  z-index: 1000;
  position: sticky;
  top: 0;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
`;

const NavLink = styled(Link)`
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: clamp(0.5rem, 2vw, 1rem);
  font-size: clamp(0.9rem, 2vw, 1rem);
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--accent-color);
    background: rgba(255, 255, 255, 0.1);
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    justify-content: center;
    font-size: clamp(1.2rem, 4vw, 1.5rem);
    padding: clamp(1rem, 3vw, 1.5rem);
  }
`;

const Logo = styled(Link)`
  color: #fff;
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
  height: 100%;
  z-index: 1001;
`;

const MobileIcon = styled.div`
  display: none;
  
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    cursor: pointer;
    color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    transition: all 0.3s ease;
    z-index: 1001;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(1rem, 3vw, 2rem);

  @media screen and (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
    width: 100%;
    height: 100vh;
    background: rgba(26, 26, 26, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    justify-content: center;
    padding: clamp(2rem, 5vw, 4rem);
    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
  }
`;

const LoginButton = styled.button`
  background: transparent;
  border: 1px solid #2ADFFF;
  color: #2ADFFF;
  padding: clamp(0.5rem, 2vw, 0.8rem) clamp(1rem, 3vw, 1.5rem);
  border-radius: 8px;
  cursor: pointer;
  font-size: clamp(0.9rem, 2vw, 1rem);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(42, 223, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(42, 223, 255, 0.2);
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: clamp(0.8rem, 3vw, 1rem);
    font-size: clamp(1rem, 3vw, 1.2rem);
    margin-top: clamp(1rem, 4vw, 2rem);
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 1rem);
  
  @media screen and (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: clamp(1rem, 3vw, 1.5rem);
  }
`;

const Avatar = styled.div`
  width: clamp(32px, 8vw, 40px);
  height: clamp(32px, 8vw, 40px);
  border-radius: 50%;
  background: #2ADFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  font-weight: 600;
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(42, 223, 255, 0.5);
    transform: scale(1.05);
  }

  @media screen and (max-width: 768px) {
    width: clamp(40px, 10vw, 48px);
    height: clamp(40px, 10vw, 48px);
    font-size: clamp(1.1rem, 3vw, 1.3rem);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  padding: clamp(1rem, 3vw, 2rem);
  
  @media screen and (max-width: 768px) {
    align-items: flex-start;
    padding-top: clamp(2rem, 10vh, 4rem);
  }
`;

const ModalContent = styled.div`
  background: #1E1E1E;
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: min(90%, 400px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setShowLogin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleLoginClick = () => {
    setIsOpen(false);
    setShowLogin(true);
  };

  return (
    <>
      <Nav>
        <Logo to="/">DuyThanh</Logo>
        
        <MobileIcon onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </MobileIcon>

        <NavMenu isOpen={isOpen}>
          <NavLink to="/" onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink to="/blog" onClick={() => setIsOpen(false)}>Blog</NavLink>
          <NavLink to="/about" onClick={() => setIsOpen(false)}>About</NavLink>
          
          {user ? (
            <UserMenu>
              <Avatar>{user.email[0].toUpperCase()}</Avatar>
              <LoginButton onClick={handleLogout}>Logout</LoginButton>
            </UserMenu>
          ) : (
            <LoginButton onClick={handleLoginClick}>Login</LoginButton>
          )}
        </NavMenu>
      </Nav>

      {showLogin && !user && (
        <Login 
          onSuccess={() => setShowLogin(false)} 
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
};

export default Navbar;
