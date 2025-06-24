import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const GridContainer = styled.div`
  width: 100%;
  height: calc(100vh - 6rem);
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  padding: 2rem;
  align-items: center;
  
  /* Hide scrollbar but keep functionality */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    height: auto;
    min-height: calc(100vh - 4rem);
    padding: 1rem;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    align-items: stretch;
    /* Enable touch scrolling on mobile */
    -webkit-overflow-scrolling: touch;
  }
`;

const ProjectsWrapper = styled.div`
  display: flex;
  gap: 3rem;
  padding: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    padding: 1rem;
    align-items: center;
    width: 100%;
    /* Ensure wrapper can expand beyond viewport */
    min-height: 100%;
  }
  
  @media (max-width: 480px) {
    gap: 1.5rem;
    padding: 0.5rem;
  }
`;

const ProjectCard = styled(motion.div)`
  width: 300px;
  height: 450px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  
  &:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  }
  
  @media (max-width: 768px) {
    width: 280px;
    height: 420px;
    max-width: 90vw;
  }
  
  @media (max-width: 480px) {
    width: 250px;
    height: 380px;
    max-width: 85vw;
  }
  
  @media (max-width: 320px) {
    width: 220px;
    height: 340px;
    max-width: 90vw;
  }
`;

const ProjectImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProjectOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const ProjectTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const ProjectCategory = styled.p`
  margin: 0.5rem 0 0;
  opacity: 0.7;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin: 0.3rem 0 0;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ExpandedProject = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #1a1a1a;
  z-index: 1000;
  overflow: hidden;
`;

const ExpandedImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
}

interface ProjectGridProps {
  projects: Project[];
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isReturning = location.state?.isReturning;
  const returningProjectId = location.state?.projectId;
  
  // Momentum scrolling state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastTime, setLastTime] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Only apply horizontal scrolling behavior on desktop
      if (window.innerWidth > 768) {
        e.preventDefault();
        // Handle both vertical scroll (converted to horizontal) and horizontal scroll
        const deltaX = e.deltaX; // Horizontal scroll from trackpad
        const deltaY = e.deltaY; // Vertical scroll from wheel/trackpad
        
        // If there's horizontal movement (trackpad swiping), prioritize that
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          container.scrollLeft += deltaX * 1;
        } else {
          // Fallback to converting vertical scroll to horizontal
          container.scrollLeft += deltaY * 1;
        }
      }
      // On mobile, let default vertical scrolling behavior work
    };

    container.addEventListener('wheel', handleWheel, { passive: window.innerWidth <= 768 });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const handleProjectClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <AnimatePresence mode="wait">
      <GridContainer ref={containerRef}>
        <ProjectsWrapper>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              whileHover={{ 
                y: -15,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              initial={isReturning && project.id === Number(returningProjectId) ? { opacity: 0 } : { opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProjectImage
                src={project.image}
                alt={project.title}
                layoutId={`project-${project.id}`}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              <ProjectOverlay>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectCategory>{project.category}</ProjectCategory>
              </ProjectOverlay>
            </ProjectCard>
          ))}
        </ProjectsWrapper>
      </GridContainer>

      <AnimatePresence>
        {isReturning && (
          <ExpandedProject
            layoutId={`project-${returningProjectId}`}
            initial={{ borderRadius: '8px' }}
            animate={{ borderRadius: 0 }}
            exit={{ borderRadius: '8px' }}
            transition={{ duration: 0.5 }}
          >
            <ExpandedImage 
              src={projects.find(p => p.id === Number(returningProjectId))?.image} 
              alt={projects.find(p => p.id === Number(returningProjectId))?.title}
            />
            <ProjectOverlay>
              <ProjectTitle>{projects.find(p => p.id === Number(returningProjectId))?.title}</ProjectTitle>
              <ProjectCategory>{projects.find(p => p.id === Number(returningProjectId))?.category}</ProjectCategory>
            </ProjectOverlay>
          </ExpandedProject>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default ProjectGrid; 