import React, { useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useSpring, animated, useTrail, config } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import Tilt from 'react-parallax-tilt';
import { TypeAnimation } from 'react-type-animation';
import { 
  FaGithub, FaLinkedin, FaEnvelope, FaCode, 
  FaServer, FaDatabase, FaReact, FaNode, 
  FaPython, FaJava, FaDocker, FaAws 
} from 'react-icons/fa';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

// Move shimmer animation to the top with other keyframes
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(42, 223, 255, 0.3); }
  50% { box-shadow: 0 0 30px rgba(42, 223, 255, 0.6); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// Animation keyframes
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.5; }
`;

const floatGlow = keyframes`
  0%, 100% { 
    transform: translateY(0) rotate(0deg);
    filter: drop-shadow(0 0 5px rgba(42, 223, 255, 0.3));
  }
  50% { 
    transform: translateY(-10px) rotate(5deg);
    filter: drop-shadow(0 0 20px rgba(42, 223, 255, 0.6));
  }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const glitch = keyframes`
  0% {
    clip-path: inset(80% 0 0 0);
    transform: translate(-2px, 2px);
  }
  10% {
    clip-path: inset(10% 0 85% 0);
    transform: translate(1px, -3px);
  }
  20% {
    clip-path: inset(80% 0 0 0);
    transform: translate(-5px, 2px);
  }
  30% {
    clip-path: inset(10% 0 85% 0);
    transform: translate(3px, -2px);
  }
  40% {
    clip-path: inset(50% 0 30% 0);
    transform: translate(-2px, 1px);
  }
  50% {
    clip-path: inset(0% 0 100% 0);
    transform: translate(3px, 2px);
  }
  60% {
    clip-path: inset(100% 0 0% 0);
    transform: translate(-3px, 1px);
  }
  100% {
    clip-path: inset(80% 0 0 0);
    transform: translate(0);
  }
`;

// Variants for framer-motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

// Styled components
const AboutContainer = styled(motion.div)`
  min-height: calc(100vh - var(--header-height));
  padding: clamp(1rem, 5vw, 3rem);
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Section = styled(motion.section)`
  margin-bottom: 4rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: var(--accent-color);
  margin-bottom: 2rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 3px;
    background: var(--accent-color);
    border-radius: 2px;
  }
`;

const SkillGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const SkillCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(42, 223, 255, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      rgba(42, 223, 255, 0.1) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const ProgressBar = styled(motion.div)`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-top: 1rem;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: var(--accent-color);
    border-radius: 3px;
    transition: width 1s ease-out;
  }
`;

const TimelineContainer = styled(motion.div)`
  position: relative;
  padding: 2rem 0;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: rgba(42, 223, 255, 0.2);
  }
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  justify-content: ${props => props.align === 'left' ? 'flex-start' : 'flex-end'};
  padding: 2rem 0;
  width: 100%;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const TimelineContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 15px;
  max-width: 500px;
  position: relative;
  border: 1px solid rgba(42, 223, 255, 0.1);
`;

// Add decorative elements
const Particle = styled.div`
  position: absolute;
  width: ${props => props.size || '10px'};
  height: ${props => props.size || '10px'};
  background: rgba(42, 223, 255, ${props => props.opacity || '0.1'});
  border-radius: 50%;
  top: ${props => props.top};
  left: ${props => props.left};
  animation: ${float} ${props => props.duration || '3s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
`;

const HeroSection = styled(motion.div)`
  text-align: center;
  padding: clamp(3rem, 10vw, 6rem) 1rem;
  background: linear-gradient(135deg, 
    rgba(26, 26, 26, 0.97) 0%,
    rgba(42, 42, 42, 0.97) 100%
  );
  border-radius: var(--border-radius-lg);
  position: relative;
  overflow: hidden;
  margin-bottom: 3rem;
  box-shadow: var(--box-shadow);
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(42, 223, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(42, 223, 255, 0.15) 0%, transparent 50%),
      linear-gradient(45deg, rgba(42, 223, 255, 0.05) 0%, transparent 70%),
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(42, 223, 255, 0.02) 10px,
        rgba(42, 223, 255, 0.02) 20px
      );
    z-index: 0;
    animation: ${gradientMove} 15s ease infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent,
      rgba(42, 223, 255, 0.5),
      transparent
    );
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #2ADFFF 0%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 1;
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.1rem, 2.5vw, 1.3rem);
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  position: relative;
  z-index: 1;
`;

const ContactSection = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
  flex-wrap: wrap;
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(42, 223, 255, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg,
      rgba(42, 223, 255, 0.5),
      rgba(255, 255, 255, 0.1),
      rgba(42, 223, 255, 0.5)
    );
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
    animation: ${shimmer} 2s linear infinite;
    background-size: 200% 100%;
  }

  &:hover {
    transform: translateY(-2px);
    background: rgba(42, 223, 255, 0.1);
    border-color: rgba(42, 223, 255, 0.3);

    &::before {
      opacity: 1;
    }

    svg {
      transform: scale(1.2);
    }
  }

  svg {
    font-size: 1.4rem;
    color: var(--accent-color);
    transition: transform 0.3s ease;
  }
`;

// Add a background decorator
const BackgroundDecorator = styled.div`
  position: fixed;
  inset: 0;
  background: 
    radial-gradient(circle at 10% 10%, rgba(42, 223, 255, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 90% 90%, rgba(42, 223, 255, 0.03) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
`;

// Add an orbit effect component
const OrbitRing = styled.div`
  position: absolute;
  width: ${props => props.size || '100px'};
  height: ${props => props.size || '100px'};
  border: 1px solid rgba(42, 223, 255, 0.1);
  border-radius: 50%;
  animation: ${rotate} ${props => props.duration || '20s'} linear infinite;
  pointer-events: none;
  z-index: 0;
  
  &::before {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--accent-color);
    border-radius: 50%;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 10px rgba(42, 223, 255, 0.5);
  }
`;

// Add a decorative circle component
const Circle = styled.div`
  position: absolute;
  width: ${props => props.size || '300px'};
  height: ${props => props.size || '300px'};
  border: 1px solid rgba(42, 223, 255, 0.1);
  border-radius: 50%;
  opacity: 0.5;
  animation: ${pulse} 4s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  pointer-events: none;
  z-index: 0;
`;

// Add a stat section
const StatsSection = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  text-align: center;
  position: relative;
  overflow: hidden;

  h4 {
    font-size: 2.5rem;
    color: var(--accent-color);
    margin: 0;
    font-weight: 700;
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    margin: 0.5rem 0 0;
    font-size: 0.9rem;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
      transparent,
      rgba(42, 223, 255, 0.1),
      transparent
    );
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  &:hover::before {
    transform: translateX(100%);
  }
`;

// Add a floating tech icon component
const FloatingIcon = styled(motion.div)`
  position: absolute;
  font-size: ${props => props.size || '30px'};
  color: var(--accent-color);
  opacity: ${props => props.opacity || 0.1};
  animation: ${floatGlow} ${props => props.duration || '6s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  z-index: 0;
`;

// Add a 3D card effect
const Card3D = styled(Tilt)`
  transform-style: preserve-3d;
  transform: perspective(1000px);
`;

// Add a skill progress ring component
const ProgressRing = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 1rem auto;

  svg {
    transform: rotate(-90deg);
    
    circle {
      fill: none;
      stroke-width: 8;
      stroke-linecap: round;
      
      &.bg {
        stroke: rgba(255, 255, 255, 0.1);
      }
      
      &.progress {
        stroke: var(--accent-color);
        stroke-dasharray: ${props => props.progress * 2.51327};
        stroke-dashoffset: 0;
        transition: stroke-dasharray 1s ease;
      }
    }
  }

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5rem;
    color: var(--accent-color);
    font-weight: bold;
  }
`;

// Add a wave effect component
const WaveContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  overflow: hidden;
  
  .wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%232ADFFF' fill-opacity='0.1'/%3E%3C/svg%3E");
    animation: wave 15s linear infinite;
    transform: translate3d(0, 0, 0);
    
    &:nth-child(2) {
      bottom: 0;
      animation: wave 30s linear infinite;
      opacity: 0.5;
    }
    
    &:nth-child(3) {
      bottom: 0;
      animation: wave 45s linear infinite;
      opacity: 0.2;
    }
  }

  @keyframes wave {
    0% { transform: translateX(0); }
    50% { transform: translateX(-50%); }
    100% { transform: translateX(-100%); }
  }
`;

// Add a glitch effect to Title
const GlitchText = styled.span`
  position: relative;
  display: inline-block;

  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--background);
  }

  &::before {
    left: 2px;
    text-shadow: -2px 0 #ff00c1;
    animation: ${glitch} 2s infinite linear alternate-reverse;
  }

  &::after {
    left: -2px;
    text-shadow: 2px 0 #00fff9;
    animation: ${glitch} 2s infinite linear alternate;
  }
`;

// Add particles configuration
const particlesConfig = {
  particles: {
    number: { value: 30 },
    color: { value: "#2ADFFF" },
    opacity: {
      value: 0.1,
      random: true
    },
    size: {
      value: 3,
      random: true
    },
    move: {
      enable: true,
      speed: 0.5,
      random: true,
      direction: "none"
    },
    links: {
      enable: true,
      distance: 150,
      color: "#2ADFFF",
      opacity: 0.1,
      width: 1
    }
  }
};

function About() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const trail = useTrail(3, {
    from: { opacity: 0, y: 50 },
    to: { opacity: inView ? 1 : 0, y: inView ? 0 : 50 },
    config: config.gentle
  });

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const techStack = [FaReact, FaNode, FaDatabase, FaPython, FaDocker, FaAws];

  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesConfig}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0
        }}
      />
      <BackgroundDecorator />
      <AboutContainer ref={ref}>
        <HeroSection>
          <Particle size="15px" top="10%" left="10%" duration="4s" />
          <Particle size="10px" top="20%" left="80%" duration="6s" delay="1s" />
          <Particle size="12px" top="60%" left="15%" duration="5s" delay="0.5s" />
          <Particle size="8px" top="70%" left="70%" duration="7s" delay="2s" />
          <Particle size="20px" top="85%" left="85%" duration="8s" delay="1.5s" opacity="0.05" />
          <FloatingIcon 
            as={FaReact} 
            size="40px" 
            style={{ top: '15%', right: '10%' }} 
            duration="8s"
          />
          <FloatingIcon 
            as={FaNode} 
            size="35px" 
            style={{ bottom: '20%', left: '15%' }} 
            duration="7s"
            delay="1s"
          />
          <FloatingIcon 
            as={FaDatabase} 
            size="30px" 
            style={{ top: '30%', left: '10%' }} 
            duration="6s"
            delay="2s"
          />
          <Title>
            <GlitchText data-text="About Me">About Me</GlitchText>
          </Title>
          <Subtitle>
            A passionate full-stack developer focused on creating beautiful and functional web applications
          </Subtitle>
          <WaveContainer>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </WaveContainer>
        </HeroSection>

        <Section>
          <Circle size="200px" style={{ top: '-100px', right: '-100px' }} />
          <Circle size="150px" style={{ bottom: '-75px', left: '-75px' }} delay="2s" />
          <OrbitRing size="150px" style={{ top: '20px', right: '50px' }} />
          <OrbitRing size="100px" style={{ bottom: '40px', left: '30px' }} duration="15s" />
          
          <StatsSection>
            {trail.map((props, index) => (
              <animated.div key={index} style={props}>
                <StatCard
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h4>5+</h4>
                  <p>Years Experience</p>
                </StatCard>
              </animated.div>
            ))}
          </StatsSection>
        </Section>

        <Section>
          <SectionTitle>Technical Skills</SectionTitle>
          <SkillGrid>
            <Card3D
              whileHover={{
                rotateX: 5,
                rotateY: 5,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <SkillCard whileHover={{ scale: 1.02 }}>
                <h3><FaCode /> Frontend</h3>
                <ul>
                  <li>
                    <FaReact /> React.js
                    <ProgressBar progress={95} />
                  </li>
                  <li>
                    <FaCode /> TypeScript
                    <ProgressBar progress={90} />
                  </li>
                  <li><FaCode /> CSS/SASS</li>
                  <li><FaReact /> Next.js</li>
                </ul>
              </SkillCard>
            </Card3D>

            <Card3D
              whileHover={{
                rotateX: 5,
                rotateY: 5,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <SkillCard whileHover={{ scale: 1.02 }}>
                <h3><FaServer /> Backend</h3>
                <ul>
                  <li><FaNode /> Node.js</li>
                  <li><FaNode /> Express</li>
                  <li><FaPython /> Python</li>
                  <li><FaJava /> Java</li>
                </ul>
              </SkillCard>
            </Card3D>

            <Card3D
              whileHover={{
                rotateX: 5,
                rotateY: 5,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <SkillCard whileHover={{ scale: 1.02 }}>
                <h3><FaDatabase /> Infrastructure</h3>
                <ul>
                  <li><FaDatabase /> PostgreSQL</li>
                  <li><FaDatabase /> MongoDB</li>
                  <li><FaDocker /> Docker</li>
                  <li><FaAws /> AWS</li>
                </ul>
              </SkillCard>
            </Card3D>
          </SkillGrid>
        </Section>

        <Section>
          <SectionTitle>Get in Touch</SectionTitle>
          <ContactSection>
            <SocialLink 
              href="https://github.com/yourusername" 
              target="_blank"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub /> GitHub
            </SocialLink>
            <SocialLink 
              href="https://linkedin.com/in/yourusername" 
              target="_blank"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaLinkedin /> LinkedIn
            </SocialLink>
            <SocialLink 
              href="mailto:your.email@example.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEnvelope /> Email
            </SocialLink>
          </ContactSection>
        </Section>
      </AboutContainer>
      {techStack.map((Icon, index) => (
        <FloatingIcon
          key={index}
          as={Icon}
          size={`${Math.random() * 20 + 20}px`}
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
          }}
          duration={`${Math.random() * 4 + 4}s`}
          delay={`${Math.random() * 2}s`}
          opacity={0.2}
        />
      ))}
    </>
  );
}

export default About; 