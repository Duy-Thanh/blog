import styled from 'styled-components';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: var(--primary-color);
  color: #fff;
  padding: clamp(2rem, 4vw, 3rem) 0;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 clamp(1rem, 3vw, 2rem);
  gap: clamp(1rem, 3vw, 2rem);

  @media screen and (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: clamp(0.8rem, 2vw, 1.2rem);
  
  a {
    color: #fff;
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    transition: all 0.3s ease;
    padding: 0.5rem;
    border-radius: 8px;
    
    &:hover {
      color: var(--accent-color);
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.1);
    }
  }

  @media screen and (max-width: 768px) {
    margin-top: 1rem;
  }
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterWrapper>
        <div>
          <p>© 2024 DuyThanh. All rights reserved.</p>
        </div>
        <SocialIcons>
          <a href="https://github.com/duy-thanh" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
          <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://twitter.com/your-profile" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
        </SocialIcons>
      </FooterWrapper>
    </FooterContainer>
  );
}

export default Footer; 