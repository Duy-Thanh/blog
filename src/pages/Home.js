import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaGithub, FaExternalLinkAlt, FaLinkedin, FaEnvelope, FaQuoteLeft } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HeroSection = styled(motion.section)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.95) 100%);
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
    opacity: 0.5;
    animation: rotate 20s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const HeroContent = styled(motion.div)`
  max-width: 800px;
  text-align: center;
  z-index: 1;
  padding: 2rem;
  background: rgba(32, 32, 32, 0.7);
  border-radius: 24px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(42, 223, 255, 0.1),
    inset 0 0 80px rgba(42, 223, 255, 0.05);
  backdrop-filter: blur(10px);
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #2ADFFF 0%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(42, 223, 255, 0.5);
`;

const Subtitle = styled(motion.h2)`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Description = styled(motion.p)`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 3rem;

  a {
    color: #2ADFFF;
    font-size: 1.5rem;
    transition: all 0.3s ease;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(42, 223, 255, 0.2);
      transform: scale(0);
      transition: transform 0.3s ease;
    }

    &:hover {
      transform: translateY(-3px);
      color: #fff;

      &::after {
        transform: scale(1.5);
      }
    }
  }
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2ADFFF;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2ADFFF 0%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(42, 223, 255, 0.5);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #2ADFFF, transparent);
    border-radius: 2px;
  }
`;

const ProjectsSection = styled.section`
  padding: 6rem 2rem;
  background: rgba(26, 26, 26, 0.95);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(42, 223, 255, 0.3), transparent);
  }
`;

const ProjectsContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProjectCard = styled.div`
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProjectInfo = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
`;

const ProjectDescription = styled.p`
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const ProjectTech = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const TechTag = styled.span`
  background: rgba(97, 218, 251, 0.1);
  color: var(--accent-color);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
  
  a {
    color: var(--primary-color);
    font-size: 1.2rem;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--accent-color);
    }
  }
`;

const SkillsSection = styled.section`
  padding: 6rem 2rem;
  background: #f8f9fa;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SkillCard = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
  }

  svg {
    font-size: 2.5rem;
    color: var(--accent-color);
    margin-bottom: 1rem;
  }
`;

const ContactSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, #2a2a2a 100%);
  color: #fff;
`;

const ContactContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const ContactTitle = styled(SectionTitle)`
  color: #fff;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
`;

const Input = styled.input`
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  transition: background 0.3s ease;

  &:focus {
    background: rgba(255, 255, 255, 0.15);
    outline: none;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  min-height: 150px;
  transition: background 0.3s ease;

  &:focus {
    background: rgba(255, 255, 255, 0.15);
    outline: none;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  background: var(--accent-color);
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;
  margin: 0 auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(97, 218, 251, 0.3);
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 4rem auto;
  text-align: center;
`;

const StatItem = styled.div`
  h3 {
    font-size: 2.5rem;
    color: var(--accent-color);
    margin-bottom: 0.5rem;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
  }
`;

const TimelineSection = styled.section`
  padding: 6rem 2rem;
  background: #f8f9fa;
`;

const Timeline = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 2px;
    background: var(--accent-color);
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -1px;
  }

  @media (max-width: 768px) {
    &::after {
      left: 31px;
    }
  }
`;

const TimelineItem = styled.div`
  padding: 10px 40px;
  position: relative;
  width: 50%;
  left: ${props => props.$right ? '50%' : '0'};

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: var(--accent-color);
    border-radius: 50%;
    top: 15px;
    right: ${props => props.$right ? 'auto' : '-10px'};
    left: ${props => props.$right ? '-10px' : 'auto'};
  }

  @media (max-width: 768px) {
    width: 100%;
    left: 0;
    padding-left: 70px;

    &::before {
      left: 21px;
    }
  }
`;

const TimelineContent = styled.div`
  padding: 20px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const TestimonialsSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  color: #fff;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TestimonialCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 15px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    pointer-events: none;
  }
`;

const QuoteIcon = styled(FaQuoteLeft)`
  font-size: 2rem;
  color: var(--accent-color);
  margin-bottom: 1rem;
`;

const TestimonialText = styled.p`
  font-style: italic;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthorAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorInfo = styled.div`
  h4 {
    color: var(--accent-color);
    margin-bottom: 0.2rem;
  }

  p {
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const ServicesSection = styled.section`
  padding: 6rem 2rem;
  background: #fff;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ServiceCard = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--accent-color);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scaleX(1);
  }
`;

const ServiceIcon = styled.div`
  font-size: 2.5rem;
  color: var(--accent-color);
  margin-bottom: 1rem;
`;

const BlogPreviewSection = styled.section`
  padding: 6rem 2rem;
  background: #f8f9fa;
`;

const BlogPreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const BlogPreviewCard = styled.div`
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const BlogPreviewImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const BlogPreviewContent = styled.div`
  padding: 1.5rem;
`;

const BlogPreviewDate = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const ViewAllButton = styled.button`
  background: var(--accent-color);
  color: #fff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 3rem auto 0;
  display: block;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(97, 218, 251, 0.3);
  }
`;

const AchievementsSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, #2a2a2a 100%);
  color: #fff;
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const AchievementCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(42, 223, 255, 0.1);
  }

  h3 {
    font-size: 2.5rem;
    color: #2ADFFF;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #2ADFFF 0%, #fff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 20px rgba(42, 223, 255, 0.3);
  }

  h4 {
    font-size: 1.2rem;
    color: #fff;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    font-size: 1rem;
  }
`;

function Home() {
  const projects = [
    {
      title: "Tech Blog Platform",
      description: "A full-stack blog platform built with React and Node.js, featuring markdown support and user authentication.",
      image: "https://via.placeholder.com/400x200",
      tech: ["React", "Node.js", "MongoDB"],
      github: "https://github.com/yourusername/project1",
      demo: "https://project1-demo.com"
    },
    {
      title: "E-commerce Dashboard",
      description: "An administrative dashboard for managing online stores, with real-time analytics and inventory management.",
      image: "https://via.placeholder.com/400x200",
      tech: ["React", "Redux", "Firebase"],
      github: "https://github.com/yourusername/project2",
      demo: "https://project2-demo.com"
    },
    {
      title: "Weather App",
      description: "A weather application that provides real-time weather data and forecasts using modern APIs.",
      image: "https://via.placeholder.com/400x200",
      tech: ["React", "API", "CSS3"],
      github: "https://github.com/yourusername/project3",
      demo: "https://project3-demo.com"
    }
  ];

  const skills = [
    {
      title: "Frontend Development",
      description: "Building responsive and interactive user interfaces with React, JavaScript, and modern CSS",
      icon: "💻"
    },
    {
      title: "Backend Development",
      description: "Creating robust server-side applications with Node.js and Express",
      icon: "🔧"
    },
    {
      title: "Database Design",
      description: "Designing and implementing efficient database solutions with MongoDB and SQL",
      icon: "🗄️"
    },
    {
      title: "API Development",
      description: "Building RESTful APIs and integrating third-party services",
      icon: "🔌"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const testimonials = [
    {
      text: "Working with DuyThanh was an absolute pleasure. Their technical expertise and attention to detail resulted in an outstanding product.",
      author: "John Doe",
      position: "CEO, Tech Corp",
      avatar: "https://via.placeholder.com/50"
    },
    {
      text: "Exceptional developer who consistently delivers high-quality work. Their problem-solving skills are remarkable.",
      author: "Jane Smith",
      position: "CTO, StartUp Inc",
      avatar: "https://via.placeholder.com/50"
    },
    {
      text: "Innovative solutions, clear communication, and timely delivery. Couldn't ask for a better development partner.",
      author: "Mike Johnson",
      position: "Product Manager, Innovation Labs",
      avatar: "https://via.placeholder.com/50"
    }
  ];

  const timelineEvents = [
    {
      year: "2024",
      title: "Senior Developer",
      company: "Tech Corp",
      description: "Leading development team and architecting scalable solutions"
    },
    {
      year: "2022",
      title: "Full Stack Developer",
      company: "StartUp Inc",
      description: "Built and maintained multiple web applications"
    },
    {
      year: "2020",
      title: "Junior Developer",
      company: "Code Labs",
      description: "Started professional journey in web development"
    }
  ];

  const services = [
    {
      icon: "🚀",
      title: "Web Development",
      description: "Building modern, responsive websites and web applications using the latest technologies."
    },
    {
      icon: "📱",
      title: "Mobile Development",
      description: "Creating cross-platform mobile applications with React Native and modern frameworks."
    },
    {
      icon: "⚡",
      title: "Performance Optimization",
      description: "Optimizing web applications for maximum speed and efficiency."
    },
    {
      icon: "🛠️",
      title: "Technical Consulting",
      description: "Providing expert advice on technology choices and architecture decisions."
    }
  ];

  const blogPreviews = [
    {
      title: "The Future of Web Development",
      excerpt: "Exploring upcoming trends and technologies in web development...",
      date: "2024-02-20",
      image: "https://via.placeholder.com/400x200"
    },
    {
      title: "Mastering React Hooks",
      excerpt: "A comprehensive guide to using React Hooks effectively...",
      date: "2024-02-15",
      image: "https://via.placeholder.com/400x200"
    },
    {
      title: "Building Scalable Applications",
      excerpt: "Best practices for creating maintainable and scalable apps...",
      date: "2024-02-10",
      image: "https://via.placeholder.com/400x200"
    }
  ];

  const achievements = [
    {
      number: "100+",
      title: "Projects Completed",
      description: "Successfully delivered projects across various industries"
    },
    {
      number: "50+",
      title: "Happy Clients",
      description: "Satisfied clients from around the world"
    },
    {
      number: "5+",
      title: "Years Experience",
      description: "Years of professional development experience"
    },
    {
      number: "30+",
      title: "Technologies",
      description: "Different technologies and frameworks mastered"
    }
  ];

  return (
    <>
      <HeroSection>
        <HeroContent
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Hi, I'm DuyThanh
          </Title>
          <Subtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Software Developer & Tech Enthusiast
          </Subtitle>
          <Description
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            I specialize in building exceptional digital experiences. 
            Currently, I'm focused on building accessible, human-centered products
            using modern web technologies.
          </Description>
          <SocialLinks
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <motion.a 
              href="https://github.com/Duy-Thanh"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaGithub />
            </motion.a>
            <motion.a 
              href="https://linkedin.com/in/thanhdz167"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaLinkedin />
            </motion.a>
            <motion.a 
              href="mailto:thanhdz167@gmail.com"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaEnvelope />
            </motion.a>
          </SocialLinks>
        </HeroContent>
      </HeroSection>

      <ProjectsSection>
        <SectionTitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Featured Projects
        </SectionTitle>
        <ProjectsContainer>
          <ProjectGrid>
            {projects.map((project, index) => (
              <ProjectCard key={index}>
                <ProjectImage src={project.image} alt={project.title} />
                <ProjectInfo>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectDescription>{project.description}</ProjectDescription>
                  <ProjectTech>
                    {project.tech.map((tech, index) => (
                      <TechTag key={index}>{tech}</TechTag>
                    ))}
                  </ProjectTech>
                  <ProjectLinks>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <FaGithub />
                    </a>
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <FaExternalLinkAlt />
                    </a>
                  </ProjectLinks>
                </ProjectInfo>
              </ProjectCard>
            ))}
          </ProjectGrid>
        </ProjectsContainer>
      </ProjectsSection>

      <TimelineSection>
        <SectionTitle>Experience</SectionTitle>
        <Timeline>
          {timelineEvents.map((event, index) => (
            <TimelineItem 
              key={index} 
              $right={index % 2 === 1}
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
            >
              <TimelineContent>
                <h3>{event.title}</h3>
                <h4>{event.company}</h4>
                <p>{event.year}</p>
                <p>{event.description}</p>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </TimelineSection>

      <SkillsSection>
        <SectionTitle>Skills & Expertise</SectionTitle>
        <SkillsGrid>
          {skills.map((skill, index) => (
            <SkillCard key={index}>
              <div>{skill.icon}</div>
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
            </SkillCard>
          ))}
        </SkillsGrid>
      </SkillsSection>

      <TestimonialsSection>
        <SectionTitle style={{ color: '#fff' }}>Testimonials</SectionTitle>
        <TestimonialsGrid>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <QuoteIcon />
              <TestimonialText>{testimonial.text}</TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar src={testimonial.avatar} alt={testimonial.author} />
                <AuthorInfo>
                  <h4>{testimonial.author}</h4>
                  <p>{testimonial.position}</p>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>
          ))}
        </TestimonialsGrid>
      </TestimonialsSection>

      <ServicesSection>
        <SectionTitle>Services</SectionTitle>
        <ServiceGrid>
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <ServiceIcon>{service.icon}</ServiceIcon>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </ServiceCard>
          ))}
        </ServiceGrid>
      </ServicesSection>

      <BlogPreviewSection>
        <SectionTitle>Latest Blog Posts</SectionTitle>
        <BlogPreviewGrid>
          {blogPreviews.map((post, index) => (
            <BlogPreviewCard 
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <BlogPreviewImage src={post.image} alt={post.title} />
              <BlogPreviewContent>
                <BlogPreviewDate>{new Date(post.date).toLocaleDateString()}</BlogPreviewDate>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </BlogPreviewContent>
            </BlogPreviewCard>
          ))}
        </BlogPreviewGrid>
        <ViewAllButton onClick={() => window.location.href = '/blog'}>
          View All Posts
        </ViewAllButton>
      </BlogPreviewSection>

      <AchievementsSection>
        <SectionTitle>Achievements</SectionTitle>
        <AchievementGrid>
          {achievements.map((achievement, index) => (
            <AchievementCard 
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <h3>{achievement.number}</h3>
              <h4>{achievement.title}</h4>
              <p>{achievement.description}</p>
            </AchievementCard>
          ))}
        </AchievementGrid>
      </AchievementsSection>

      <ContactSection>
        <ContactContent>
          <ContactTitle>Get In Touch</ContactTitle>
          <p>Have a question or want to work together?</p>
          <ContactForm onSubmit={handleSubmit}>
            <FormGroup>
              <Input type="text" placeholder="Your Name" required />
            </FormGroup>
            <FormGroup>
              <Input type="email" placeholder="Your Email" required />
            </FormGroup>
            <FormGroup>
              <TextArea placeholder="Your Message" required />
            </FormGroup>
            <SubmitButton type="submit">Send Message</SubmitButton>
          </ContactForm>
        </ContactContent>
      </ContactSection>
    </>
  );
}

export default Home; 