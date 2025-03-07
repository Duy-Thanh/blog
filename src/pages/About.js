import styled from 'styled-components';
import { FaCode, FaServer, FaMobile, FaGraduationCap, FaBriefcase, FaAward, FaCertificate, FaTools, FaLaptopCode, FaDownload, FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 2rem);
  overflow-x: hidden;
  color: var(--text-color);
  background: var(--background-color);
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: clamp(2rem, 5vw, 4rem);
  padding: clamp(1rem, 3vw, 2rem);

  h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    margin-bottom: clamp(0.5rem, 2vw, 1rem);
    background: linear-gradient(135deg, var(--accent-color) 0%, var(--text-color) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: clamp(1rem, 2vw, 1.2rem);
    max-width: min(100%, 800px);
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const Section = styled.section`
  margin-bottom: 6rem;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    text-align: center;
    color: var(--accent-color);
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: clamp(1rem, 3vw, 2rem);
  margin-top: clamp(1rem, 3vw, 2rem);
`;

const SkillCard = styled(motion.div)`
  background: var(--card-background);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: var(--accent-color);
    box-shadow: 0 5px 15px rgba(var(--accent-rgb), 0.2);
  }

  svg {
    font-size: 2.5rem;
    color: var(--accent-color);
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--text-color);
  }

  p {
    color: var(--text-secondary);
    line-height: 1.6;
  }
`;

const Timeline = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 5vw, 3rem);

  &::after {
    content: '';
    position: absolute;
    width: 2px;
    background: var(--accent-color);
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -1px;

    @media (max-width: 768px) {
      left: 1rem;
    }
  }
`;

const TimelineItem = styled(motion.div)`
  padding: clamp(1rem, 3vw, 2rem);
  position: relative;
  width: 50%;
  left: ${props => props.$right ? '50%' : '0'};

  @media (max-width: 768px) {
    width: 100%;
    left: 0;
    padding-left: 3rem;
  }
`;

const TimelineContent = styled.div`
  padding: 20px;
  background: var(--card-background);
  border-radius: 15px;
  border: 1px solid var(--border-color);

  h3 {
    color: var(--accent-color);
    margin-bottom: 0.5rem;
  }

  h4 {
    color: var(--text-color);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-secondary);
  }
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const AchievementCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  svg {
    font-size: 2.5rem;
    color: var(--accent-color);
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 2rem;
    color: #fff;
    margin-bottom: 0.5rem;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const TechStackSection = styled(Section)`
  background: rgba(255, 255, 255, 0.02);
  padding: 4rem 2rem;
  border-radius: 20px;
`;

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 2rem;
  text-align: center;
`;

const TechItem = styled(motion.div)`
  img {
    width: 50px;
    height: 50px;
    margin-bottom: 1rem;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
  }
`;

const EducationSection = styled(Section)`
  .education-card {
    background: rgba(255, 255, 255, 0.05);
    padding: 2rem;
    border-radius: 15px;
    margin-bottom: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const CertificationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const CertificationCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  h4 {
    color: var(--accent-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .date {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 1rem;
  }
`;

const ResumeButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--accent-color);
  color: var(--text-on-accent);
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  margin-top: 2rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(var(--accent-rgb), 0.3);
    background: var(--accent-hover);
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: clamp(1rem, 3vw, 2rem);
  margin: clamp(2rem, 5vw, 4rem) 0;
`;

const StatCard = styled(motion.div)`
  background: var(--card-background);
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  border: 1px solid var(--border-color);

  h3 {
    font-size: 2.5rem;
    color: var(--accent-color);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-secondary);
  }
`;

const SocialSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;

  a {
    color: #fff;
    font-size: 1.5rem;
    transition: all 0.3s ease;

    &:hover {
      color: var(--accent-color);
      transform: translateY(-3px);
    }
  }
`;

const SkillProgressSection = styled.div`
  margin-top: 3rem;
`;

const SkillBar = styled.div`
  margin-bottom: 1.5rem;

  .skill-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    color: var(--text-color);
  }

  .progress-bar {
    height: 8px;
    background: var(--progress-background);
    border-radius: 4px;
    overflow: hidden;

    .progress {
      height: 100%;
      background: var(--accent-color);
      border-radius: 4px;
      width: ${props => props.$progress}%;
      transition: width 1s ease-in-out;
    }
  }
`;

const QuoteSection = styled(Section)`
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(97, 218, 251, 0.1) 0%, transparent 100%);
  border-radius: var(--border-radius);
  margin: 4rem 0;

  blockquote {
    font-size: 1.5rem;
    font-style: italic;
    color: var(--text-color);
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const InterestsSection = styled(Section)`
  .interests-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
`;

const InterestCard = styled(motion.div)`
  background: var(--card-background);
  padding: var(--card-padding);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  text-align: center;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(var(--accent-rgb), 0.1) 0%, 
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  svg {
    font-size: 2.5rem;
    color: var(--accent-color);
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.5rem;
    margin: 1rem 0;
    color: var(--text-color);
    position: relative;
  }

  p {
    color: var(--text-secondary);
    line-height: 1.6;
    position: relative;
  }

  &:hover {
    border-color: var(--accent-color);
    transform: translateY(-5px);
    transition: all 0.3s ease;
    box-shadow: 0 10px 20px rgba(var(--accent-rgb), 0.15);
  }

  .icon-wrapper {
    width: 60px;
    height: 60px;
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--accent-rgb), 0.1);
    border-radius: 50%;
    transition: all 0.3s ease;

    span {
      font-size: 2rem;
    }
  }

  &:hover .icon-wrapper {
    transform: scale(1.1) rotate(5deg);
    background: rgba(var(--accent-rgb), 0.2);
  }
`;

const LanguageSection = styled.section`
  .language-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
    gap: clamp(1rem, 3vw, 2rem);
    margin-top: clamp(1rem, 3vw, 2rem);
  }
`;

const LanguageCard = styled(motion.div)`
  background: var(--card-background);
  padding: var(--card-padding);
  border-radius: var(--border-radius);
  text-align: center;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(var(--accent-rgb), 0.1) 0%, 
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  .language-level {
    width: 120px;
    height: 120px;
    margin: 0 auto 1.5rem;
    position: relative;
    
    svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
      filter: drop-shadow(0 0 8px rgba(var(--accent-rgb), 0.3));
    }

    circle {
      fill: none;
      stroke-width: 6;
      stroke-linecap: round;
      
      &.bg {
        stroke: var(--progress-background);
      }
      
      &.progress {
        stroke: var(--accent-color);
        filter: drop-shadow(0 0 3px var(--accent-color));
      }
    }

    .percentage {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.5rem;
      color: var(--accent-color);
      font-weight: bold;
    }
  }

  h3 {
    color: var(--text-color);
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    position: relative;
  }

  p {
    color: var(--text-secondary);
    font-size: 1rem;
    position: relative;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: var(--accent-color);
    box-shadow: 0 10px 20px rgba(var(--accent-rgb), 0.15);
    transition: all 0.3s ease;
  }
`;

function About() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const techStack = [
    { name: 'React', icon: '/icons/react.svg' },
    { name: 'Node.js', icon: '/icons/nodejs.svg' },
    { name: 'TypeScript', icon: '/icons/typescript.svg' },
    { name: 'Supabase', icon: '/icons/supabase.svg' },
    { name: 'Git', icon: '/icons/git.svg' },
    { name: 'Docker', icon: '/icons/docker.svg' },
    // Add more tech stack items
  ];

  const certifications = [
    {
      title: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      date: '2024',
      credentialId: 'AWS-123456'
    },
    {
      title: 'React Developer Certification',
      issuer: 'Meta',
      date: '2023',
      credentialId: 'META-789012'
    },
    // Add more certifications
  ];

  const skills = [
    { name: 'React', progress: 90 },
    { name: 'Node.js', progress: 85 },
    { name: 'TypeScript', progress: 80 },
    { name: 'Supabase', progress: 85 },
    { name: 'UI/UX Design', progress: 75 }
  ];

  const stats = [
    { number: '3+', label: 'Years Experience' },
    { number: '50+', label: 'Projects Completed' },
    { number: '20+', label: 'Happy Clients' },
    { number: '1000+', label: 'Commits' }
  ];

  const interests = [
    { icon: "🎮", title: "Gaming", description: "Passionate about game development and eSports" },
    { icon: "📚", title: "Learning", description: "Always exploring new technologies" },
    { icon: "🎵", title: "Music", description: "Love coding with good music" },
    { icon: "✈️", title: "Travel", description: "Exploring new places and cultures" }
  ];

  const languages = [
    { name: "English", level: 90, certification: "IELTS 7.5" },
    { name: "Vietnamese", level: 100, certification: "Native" },
    // Add more languages
  ];

  return (
    <AboutContainer>
      <HeroSection>
        <h1>About Me</h1>
        <p>
          I'm a passionate Full Stack Developer with a love for creating elegant solutions 
          to complex problems. My journey in software development has been driven by 
          curiosity and a constant desire to learn and grow.
        </p>
        
        <SocialSection>
          <motion.a 
            href="https://github.com/Duy-Thanh" 
            target="_blank"
            whileHover={{ y: -3 }}
          >
            <FaGithub />
          </motion.a>
          <motion.a 
            href="https://linkedin.com/in/thanhdz167" 
            target="_blank"
            whileHover={{ y: -3 }}
          >
            <FaLinkedin />
          </motion.a>
        </SocialSection>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ResumeButton 
            href="/resume.pdf" 
            target="_blank"
            whileHover={{ y: -2 }}
          >
            <FaDownload /> Download Resume
          </ResumeButton>
        </motion.div>
      </HeroSection>

      <Section>
        <h2>Professional Skills</h2>
        <SkillProgressSection>
          {skills.map((skill, index) => (
            <SkillBar key={index}>
              <div className="skill-info">
                <span>{skill.name}</span>
                <span>{skill.progress}%</span>
              </div>
              <div className="progress-bar">
                <motion.div 
                  className="progress"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </SkillBar>
          ))}
        </SkillProgressSection>
      </Section>

      <Section>
        <h2>By the Numbers</h2>
        <StatsSection>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3>{stat.number}</h3>
              <p>{stat.label}</p>
            </StatCard>
          ))}
        </StatsSection>
      </Section>

      <TechStackSection>
        <h2>Tech Stack</h2>
        <TechGrid>
          {techStack.map((tech, index) => (
            <TechItem
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img src={tech.icon} alt={tech.name} />
              <p>{tech.name}</p>
            </TechItem>
          ))}
        </TechGrid>
      </TechStackSection>

      <Section>
        <h2>Skills & Expertise</h2>
        <SkillsGrid>
          <SkillCard
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaCode />
            <h3>Frontend Development</h3>
            <p>Crafting beautiful user interfaces with React, TypeScript, and modern CSS. 
               Experienced in responsive design and state management.</p>
          </SkillCard>
          
          <SkillCard
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FaServer />
            <h3>Backend Development</h3>
            <p>Building robust server-side applications with Node.js, Express, and Supabase. 
               Focused on scalability and performance.</p>
          </SkillCard>
          
          <SkillCard
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FaMobile />
            <h3>Mobile Development</h3>
            <p>Creating cross-platform mobile applications with React Native. 
               Experienced in mobile-first design principles.</p>
          </SkillCard>
        </SkillsGrid>
      </Section>

      <Section>
        <h2>Experience</h2>
        <Timeline>
          <TimelineItem
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TimelineContent>
              <h3>Senior Developer</h3>
              <h4>Tech Corp • 2024 - Present</h4>
              <p>Leading development team and architecting scalable solutions.</p>
            </TimelineContent>
          </TimelineItem>
          
          <TimelineItem
            $right
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TimelineContent>
              <h3>Full Stack Developer</h3>
              <h4>StartUp Inc • 2022 - 2024</h4>
              <p>Built and maintained multiple web applications using modern technologies.</p>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Section>

      <Section>
        <h2>Achievements</h2>
        <AchievementsGrid>
          <AchievementCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaAward />
            <h3>50+</h3>
            <p>Projects Completed</p>
          </AchievementCard>
          
          <AchievementCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FaGraduationCap />
            <h3>3+</h3>
            <p>Years Experience</p>
          </AchievementCard>
          
          <AchievementCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FaBriefcase />
            <h3>20+</h3>
            <p>Happy Clients</p>
          </AchievementCard>
        </AchievementsGrid>
      </Section>

      <EducationSection>
        <h2>Education</h2>
        <motion.div 
          className="education-card"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Bachelor of Computer Science</h3>
          <h4>Your University • 2020-2024</h4>
          <p>Focused on Software Engineering and Web Development. 
             Graduated with High Honors.</p>
        </motion.div>
      </EducationSection>

      <Section>
        <h2>Certifications</h2>
        <CertificationsGrid>
          {certifications.map((cert, index) => (
            <CertificationCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <FaCertificate style={{ fontSize: '2rem', color: 'var(--accent-color)', marginBottom: '1rem' }} />
              <h4>{cert.title}</h4>
              <p>{cert.issuer}</p>
              <p className="date">Issued: {cert.date}</p>
              <small>Credential ID: {cert.credentialId}</small>
            </CertificationCard>
          ))}
        </CertificationsGrid>
      </Section>

      <motion.div style={{ opacity }}>
        <Section>
          <h2>Personal Projects</h2>
          <SkillsGrid>
            <SkillCard
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FaLaptopCode />
              <h3>Personal Blog</h3>
              <p>A modern blog platform built with React and Supabase. 
                 Features markdown support and dark theme.</p>
            </SkillCard>
            {/* Add more project cards */}
          </SkillsGrid>
        </Section>
      </motion.div>

      <QuoteSection>
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          "Passionate about creating elegant solutions to complex problems, 
          I believe in the power of clean code and user-centered design."
        </motion.blockquote>
      </QuoteSection>

      <InterestsSection>
        <h2>Beyond Coding</h2>
        <div className="interests-grid">
          {interests.map((interest, index) => (
            <InterestCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="icon-wrapper">
                <span>{interest.icon}</span>
              </div>
              <h3>{interest.title}</h3>
              <p>{interest.description}</p>
            </InterestCard>
          ))}
        </div>
      </InterestsSection>

      <LanguageSection>
        <h2>Languages</h2>
        <div className="language-grid">
          {languages.map((lang, index) => (
            <LanguageCard
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="language-level">
                <svg viewBox="0 0 100 100">
                  <circle className="bg" cx="50" cy="50" r="45" />
                  <motion.circle
                    className="progress"
                    cx="50"
                    cy="50"
                    r="45"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: lang.level / 100 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    strokeDasharray="283"
                    strokeDashoffset="0"
                  />
                </svg>
                <div className="percentage">{lang.level}%</div>
              </div>
              <h3>{lang.name}</h3>
              <p>{lang.certification}</p>
            </LanguageCard>
          ))}
        </div>
      </LanguageSection>
    </AboutContainer>
  );
}

export default About; 