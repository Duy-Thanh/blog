import styled from 'styled-components';
import { FaCode, FaServer, FaMobile } from 'react-icons/fa';

const AboutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const SkillCard = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  svg {
    font-size: 2rem;
    color: var(--accent-color);
    margin-bottom: 1rem;
  }
`;

function About() {
  return (
    <AboutContainer>
      <Section>
        <h1>About Me</h1>
        <p>
          Hi! I'm a passionate software developer with a love for creating
          web applications and solving complex problems. I specialize in
          modern web technologies and always strive to learn new things.
        </p>
      </Section>

      <Section>
        <h2>Skills & Expertise</h2>
        <SkillsGrid>
          <SkillCard>
            <FaCode />
            <h3>Frontend Development</h3>
            <p>React, JavaScript, HTML5, CSS3, TypeScript</p>
          </SkillCard>
          
          <SkillCard>
            <FaServer />
            <h3>Backend Development</h3>
            <p>Node.js, Express, Python, Databases</p>
          </SkillCard>
          
          <SkillCard>
            <FaMobile />
            <h3>Mobile Development</h3>
            <p>React Native, Mobile-First Design</p>
          </SkillCard>
        </SkillsGrid>
      </Section>

      <Section>
        <h2>Experience</h2>
        <p>
          With several years of experience in software development,
          I've worked on various projects ranging from small business
          websites to large-scale applications.
        </p>
      </Section>

      <Section>
        <h2>Education</h2>
        <p>
          Bachelor's Degree in Computer Science
          <br />
          Various technical certifications and continuous learning
        </p>
      </Section>
    </AboutContainer>
  );
}

export default About; 