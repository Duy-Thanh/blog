import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import styled from 'styled-components';
import { supabase } from '../lib/supabaseClient';

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  
  // Ensure it's above everything
  isolation: isolate;
`;

const LoginContainer = styled(motion.div)`
  position: relative; // Add this
  width: min(400px, 90%);
  background: linear-gradient(
    145deg,
    rgba(32, 32, 32, 0.9) 0%,
    rgba(28, 28, 28, 0.95) 100%
  );
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(42, 223, 255, 0.1),
    inset 0 0 32px rgba(42, 223, 255, 0.05);
  backdrop-filter: blur(10px);
  z-index: 2001;
  overflow: hidden;
  
  // Remove any margins that might affect centering
  margin: 0 auto;
`;

const InnerContainer = styled.div`
  padding: clamp(1.5rem, 4vw, 2rem);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Title = styled(motion.h2)`
  color: #2ADFFF;
  text-align: center;
  font-size: clamp(1.5rem, 4vw, 1.8rem);
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 20px rgba(42, 223, 255, 0.3);
  letter-spacing: 0.5px;
`;

const InputWrapper = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: rgba(42, 223, 255, 0.5);
    box-shadow: 0 0 15px rgba(42, 223, 255, 0.1);
    background: rgba(42, 223, 255, 0.05);
  }

  svg {
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.2rem;
    min-width: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 16px;
  padding: 0.2rem 0;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, #2ADFFF 0%, #0BB8D4 100%);
  color: #000;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  box-shadow: 0 4px 15px rgba(42, 223, 255, 0.15);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(42, 223, 255, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled(motion.div)`
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  padding: 0.8rem;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 59, 48, 0.2);
`;

const HelpText = styled(motion.p)`
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  font-size: 14px;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #2ADFFF;
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-top: 2px solid #000;
  border-radius: 50%;
  margin: 0 auto;
`;

export const Login = ({ onSuccess, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      onSuccess(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClick={onClose}>
      <LoginContainer
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <InnerContainer>
          <Title
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Welcome Back
          </Title>
          
          {error && (
            <ErrorMessage
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </ErrorMessage>
          )}
          
          <form onSubmit={handleLogin}>
            <InputWrapper
              value={email}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FaEnvelope />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                disabled={isLoading}
              />
            </InputWrapper>
            
            <InputWrapper
              value={password}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FaLock />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                disabled={isLoading}
              />
            </InputWrapper>
            
            <Button
              type="submit"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                'Login'
              )}
            </Button>
          </form>
          
          <HelpText
            as={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ color: '#2ADFFF' }}
          >
            Need help? Contact support
          </HelpText>
        </InnerContainer>
      </LoginContainer>
    </Modal>
  );
}; 