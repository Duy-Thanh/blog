import styled from 'styled-components';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: var(--primary-color);
  color: #fff;
  padding: 2rem 0;
  margin-top: auto;
`;

const FooterWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  
  a {
    color: #fff;
    font-size: 1.5rem;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--accent-color);
    }
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