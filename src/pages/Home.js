import React, { useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaArrowRight, FaCode, FaLaptopCode, FaServer } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import Tilt from 'react-parallax-tilt';
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const glow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 20px rgba(42, 223, 255, 0.3)); }
  50% { filter: drop-shadow(0 0 40px rgba(42, 223, 255, 0.6)); }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const HomeContainer = styled(motion.div)`
  min-height: calc(100vh - var(--header-height));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1rem;
    justify-content: flex-start;
    padding-top: 2rem;
  }

  .particles {
    position: absolute;
    inset: 0;
    z-index: 0;
  }
`;

const HeroSection = styled(motion.div)`
  text-align: center;
  max-width: 800px;
  position: relative;
  z-index: 1;
  padding: 0 1rem;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(2rem, 8vw, 4.5rem);
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #2ADFFF 0%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 20px rgba(42, 223, 255, 0.3));
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: clamp(1.8rem, 6vw, 2.5rem);
    margin-bottom: 1rem;
  }
`;

const TypewriterText = styled.div`
  font-family: monospace;
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  color: var(--accent-color);
  margin: 1.5rem auto;
  text-align: center;
  min-height: 4em;

  @media (max-width: 768px) {
    font-size: 1rem;
    min-height: 3em;
    margin: 1rem auto;
  }
`;

const Description = styled(motion.p)`
  font-size: clamp(1rem, 2vw, 1.3rem);
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1rem;
    flex-direction: column;
    align-items: stretch;
    padding: 0 1rem;
  }
`;

const StyledButton = styled(motion.button)`
  padding: 1rem 2rem;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba(42, 223, 255, 0.1) 0%, rgba(42, 223, 255, 0.2) 100%);
  color: var(--text-color);
  border: 1px solid rgba(42, 223, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(42, 223, 255, 0.4);
    box-shadow: 0 5px 15px rgba(42, 223, 255, 0.2);

    &::before {
      left: 100%;
    }

    svg {
      transform: translateX(3px);
    }
  }

  svg {
    transition: transform 0.3s ease;
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
    justify-content: center;
  }
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  font-size: ${props => props.size || '40px'};
  color: rgba(42, 223, 255, ${props => props.opacity || '0.2'});
  animation: ${float} ${props => props.duration || '6s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  filter: drop-shadow(0 0 10px rgba(42, 223, 255, 0.3));
`;

const BackgroundGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    rgba(42, 223, 255, 0.1) 0%,
    transparent 70%
  );
  animation: ${glow} 5s ease-in-out infinite;
  pointer-events: none;
`;

const CircleDecoration = styled.div`
  position: absolute;
  width: ${props => props.size || '300px'};
  height: ${props => props.size || '300px'};
  border: 1px solid rgba(42, 223, 255, 0.1);
  border-radius: 50%;
  opacity: 0.5;
  animation: ${pulse} 4s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
`;

const OrbitingDot = styled.div`
  position: absolute;
  width: ${props => props.size || '10px'};
  height: ${props => props.size || '10px'};
  background: var(--accent-color);
  border-radius: 50%;
  animation: ${rotate} ${props => props.duration || '20s'} linear infinite;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: inherit;
    border-radius: inherit;
    filter: blur(5px);
  }
`;

const GridBackground = styled.div`
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(42, 223, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(42, 223, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.1;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: top;
  pointer-events: none;
`;

const FeatureSection = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  width: 100%;
  max-width: 1200px;
  padding: 0 1rem;

  @media (max-width: 768px) {
    margin-top: 2rem;
    gap: 1rem;
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(42, 223, 255, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;

  svg {
    font-size: 2.5rem;
    color: var(--accent-color);
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.2rem;
    color: var(--accent-color);
    margin-bottom: 1rem;
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    line-height: 1.6;
  }

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

  @media (max-width: 768px) {
    padding: 1.5rem;
    
    svg {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }

    h3 {
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
    }

    p {
      font-size: 0.85rem;
      line-height: 1.5;
    }
  }
`;

const TypewriterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
`;

// Update the particle configuration
const particlesConfig = {
  background: {
    color: {
      value: "transparent",
    },
  },
  particles: {
    color: {
      value: "#2ADFFF",
    },
    links: {
      color: "#2ADFFF",
      distance: 150,
      enable: true,
      opacity: 0.2,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 50,
    },
    opacity: {
      value: 0.3,
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
};

// Add animated feature card
const AnimatedFeatureCard = ({ icon: Icon, title, description }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const springProps = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(50px)',
  });

  return (
    <Tilt
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      scale={1.05}
      transitionSpeed={2000}
      gyroscope={true}
    >
      <animated.div ref={ref} style={springProps}>
        <FeatureCard
          whileHover={{ y: -10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon />
          <h3>{title}</h3>
          <p>{description}</p>
        </FeatureCard>
      </animated.div>
    </Tilt>
  );
};

// Add these variants for animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

function Home() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // Add spring animation for the title
  const titleSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 300, friction: 20 },
  });

  return (
    <HomeContainer>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesConfig}
        className="particles"
      />
      
      <GridBackground />
      <BackgroundGlow />
      
      <CircleDecoration size="400px" style={{ top: '-20%', right: '-10%' }} />
      <CircleDecoration size="300px" style={{ bottom: '-10%', left: '-10%' }} delay="2s" />
      
      <OrbitingDot size="8px" style={{ top: '20%', right: '20%' }} />
      <OrbitingDot size="12px" style={{ bottom: '30%', left: '20%' }} duration="25s" />
      
      <FloatingElement
        as={FaCode}
        style={{ top: '20%', left: '15%' }}
        duration="7s"
      />
      <FloatingElement
        as={FaLaptopCode}
        style={{ top: '70%', right: '10%' }}
        duration="8s"
        delay="1s"
      />
      <FloatingElement
        as={FaServer}
        style={{ top: '40%', right: '20%' }}
        duration="6s"
        delay="2s"
      />

      <HeroSection
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Title variants={itemVariants}>
          Welcome to My Portfolio
        </Title>

        <TypewriterContainer variants={itemVariants}>
          <TypewriterText>
            <TypeAnimation
              sequence={[
                'Full Stack Developer',
                1000,
                'Tech Enthusiast',
                1000,
                'Full Stack Developer\n& Tech Enthusiast',
              ]}
              wrapper="span"
              speed={50}
              style={{ display: 'inline-block', whiteSpace: 'pre-line' }}
              repeat={1}
              cursor={true}
            />
          </TypewriterText>
        </TypewriterContainer>

        <Description variants={itemVariants}>
          I create beautiful, responsive, and user-friendly web applications
          using modern technologies and best practices. Let's build something
          amazing together!
        </Description>

        <ButtonContainer variants={itemVariants}>
          <StyledButton
            as={Link}
            to="/about"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More <FaArrowRight />
          </StyledButton>
          <StyledButton
            as={Link}
            to="/blog"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Read Blog <FaArrowRight />
          </StyledButton>
        </ButtonContainer>
      </HeroSection>

      <FeatureSection>
        <AnimatedFeatureCard
          icon={FaCode}
          title="Modern Development"
          description="Using cutting-edge technologies and best practices to build scalable applications"
        />
        <AnimatedFeatureCard
          icon={FaLaptopCode}
          title="Responsive Design"
          description="Creating beautiful interfaces that work seamlessly across all devices"
        />
        <AnimatedFeatureCard
          icon={FaServer}
          title="Full Stack Solutions"
          description="End-to-end development from database design to user interface"
        />
      </FeatureSection>
    </HomeContainer>
  );
}

export default Home; 