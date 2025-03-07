import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #2ADFFF;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Message = styled.div`
  color: white;
  margin-top: 1rem;
`;

const LoadingOverlay = ({ message = "Decrypting..." }) => (
  <Overlay>
    <div>
      <Spinner />
      <Message>{message}</Message>
    </div>
  </Overlay>
);

export default LoadingOverlay; 