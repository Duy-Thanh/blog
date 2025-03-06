import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const LoginContainer = styled(motion.div)`
  max-width: 400px;
  margin: 4rem auto;
  padding: 2.5rem;
  background: rgba(32, 32, 32, 0.95);
  border-radius: 24px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(42, 223, 255, 0.1),
    inset 0 0 80px rgba(42, 223, 255, 0.05);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(
        circle at center,
        rgba(42, 223, 255, 0.1) 0%,
        transparent 50%
      ),
      linear-gradient(
        45deg,
        transparent 0%,
        rgba(42, 223, 255, 0.03) 50%,
        transparent 100%
      );
    opacity: 0;
    transition: opacity 0.3s ease;
    animation: rotate 15s linear infinite;
  }

  &:hover::before {
    opacity: 1;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const InnerContainer = styled.div`
  background: rgba(32, 32, 32, 0.95);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 
    inset 0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 0 50px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border-radius: 16px;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(42, 223, 255, 0.1),
      transparent
    );
    mask: linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }
`;

const Title = styled(motion.h2)`
  color: #2ADFFF;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 500;
  text-shadow: 
    0 0 20px rgba(42, 223, 255, 0.5),
    0 0 40px rgba(42, 223, 255, 0.3);
  letter-spacing: 0.5px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -10px;
    transform: translateX(-50%);
    width: 50px;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      #2ADFFF,
      transparent
    );
  }
`;

const ErrorMessage = styled(motion.div)`
  background: rgba(139, 0, 0, 0.3);
  color: #ff3b30;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
`;

const InputWrapper = styled(motion.div)`
  position: relative;
  margin-bottom: 1rem;
  background: ${props => props.value ? 'rgba(255, 255, 240, 0.1)' : 'rgba(32, 32, 32, 0.95)'};
  border-radius: 12px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: rgba(42, 223, 255, 0.5);
    box-shadow: 
      0 0 0 1px rgba(42, 223, 255, 0.2),
      0 0 20px rgba(42, 223, 255, 0.1);
    transform: translateY(-1px);
  }

  svg {
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.2rem;
    min-width: 20px;
    transition: all 0.3s ease;
  }

  &:focus-within svg {
    color: #2ADFFF;
    transform: scale(1.1);
  }
`;

const Input = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1rem;
  padding: 0.25rem 0;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 24px;
  height: 24px;
  border: 2px solid rgba(var(--text-on-accent-rgb), 0.3);
  border-top: 2px solid var(--text-on-accent);
  border-right: 2px solid var(--text-on-accent);
  border-radius: 50%;
  margin: 0 auto;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border: 2px solid transparent;
    border-top: 2px solid rgba(var(--text-on-accent-rgb), 0.1);
    border-radius: 50%;
    animation: pulse 1.5s linear infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.3);
      opacity: 0;
    }
    100% {
      transform: scale(1.3);
      opacity: 0;
    }
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(
    135deg,
    #2ADFFF 0%,
    #0BB8D4 100%
  );
  color: #000;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 5px 15px rgba(42, 223, 255, 0.3),
      0 0 0 1px rgba(42, 223, 255, 0.3);
  }
`;

const HelpText = styled(motion.p)`
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-size: 0.9rem;
  margin-top: 2rem;
  cursor: pointer;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 1px;
    background: #2ADFFF;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }

  &:hover {
    color: #2ADFFF;
  }
`;

export const Login = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await authService.signIn(email, password);
      onSuccess?.();
      navigate('/blog');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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
            Invalid login credentials
          </ErrorMessage>
        )}
        
        <form onSubmit={handleSubmit}>
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
  );
}; 