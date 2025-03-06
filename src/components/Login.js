import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import styled from 'styled-components';

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 300px;
`;

const Title = styled.h2`
  color: #2ADFFF;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(42, 223, 255, 0.2);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2ADFFF;
    box-shadow: 0 0 0 2px rgba(42, 223, 255, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const LoginButton = styled.button`
  background: #2ADFFF;
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(42, 223, 255, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4d;
  text-align: center;
  font-size: 0.9rem;
  background: rgba(255, 77, 77, 0.1);
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 77, 77, 0.2);
`;

const Divider = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 1.5rem 0;
`;

const HelpText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-size: 0.9rem;
  margin: 0;
`;

export const Login = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.signIn(email, password);
      onSuccess?.();
      navigate('/blog');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <LoginForm onSubmit={handleSubmit}>
      <Title>Welcome Back</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      <LoginButton type="submit">Sign In</LoginButton>
      
      <Divider />
      
      <HelpText>
        Need help? Contact support
      </HelpText>
    </LoginForm>
  );
}; 