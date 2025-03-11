import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
`;

const ModalContainer = styled(motion.div)`
  position: relative;
  width: min(${props => props.maxWidth || '400px'}, 90%);
  background: var(--card-bg);
  border-radius: 20px;
  box-shadow: var(--box-shadow);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(10px);
  z-index: 2001;
  overflow: hidden;
`;

const Modal = ({ isOpen, onClose, children, maxWidth }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContainer
            maxWidth={maxWidth}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            onClick={e => e.stopPropagation()}
          >
            {children}
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default Modal; 