import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import BeforeAfterSlider from './BeforeAfterSlider';

const BackArrow = styled(motion.button)`
  position: fixed;
  top: 2rem;
  left: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1000;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  svg {
    width: 24px;
    height: 24px;
    stroke-width: 1.5;
  }

  &:hover {
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    top: 1rem;
    left: 1rem;
    padding: 0.8rem;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    backdrop-filter: blur(10px);
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
  
  @media (max-width: 480px) {
    top: 0.8rem;
    left: 0.8rem;
    padding: 0.6rem;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const ArrowIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const ProjectContainer = styled(motion.div)`
  min-height: 100vh;
  background: #1a1a1a;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    /* Touch scrolling optimization for mobile */
    -webkit-overflow-scrolling: touch;
  }
`;

const HeroSection = styled.div`
  position: relative;
  width: 100%;
  padding: 2rem;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 300;
  letter-spacing: 2px;
  text-align: center;
  color: white;
  background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
    letter-spacing: 1px;
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }
`;

const GallerySection = styled.div`
  padding: 1rem 2rem 2rem 2rem;
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem 1rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.5rem 0.5rem 0.5rem;
  }
`;

const ImageContainer = styled.div<{ isFirst?: boolean }>`
  margin: ${props => props.isFirst ? '-4rem 0' : '1rem 0'};
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    height: 60vh;
    margin: ${props => props.isFirst ? '-2rem 0' : '0.5rem 0'};
  }
  
  @media (max-width: 480px) {
    height: 50vh;
    margin: ${props => props.isFirst ? '-1rem 0' : '0.3rem 0'};
  }
`;

const GalleryImage = styled(motion.img)`
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
  
  @media (max-width: 768px) {
    max-width: 95%;
    max-height: 55vh;
  }
  
  @media (max-width: 480px) {
    max-width: 98%;
    max-height: 45vh;
  }
`;

const ScrollProgress = styled(motion.div)`
  position: fixed;
  top: 4rem;
  right: 4rem;
  width: 60px;
  height: 40vh;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 6px;
  z-index: 1000;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  overflow: hidden;
  
  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 30vh;
    border-radius: 4px;
  }
  
  @media (max-width: 480px) {
    top: 0.8rem;
    right: 0.8rem;
    width: 35px;
    height: 25vh;
    border-radius: 3px;
  }
`;

const PageMinimap = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 7px;
  overflow: hidden;
`;

const SectionThumbnail = styled.div<{ height: number }>`
  width: 100%;
  height: ${props => props.height}%;
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
`;

const ThumbnailContent = styled.div<{ bgColor?: string }>`
  width: 100%;
  height: 100%;
  background: ${props => props.bgColor || '#2a2a2a'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
`;

const ViewportIndicator = styled(motion.div)`
  position: absolute;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  pointer-events: none;
`;

const ProjectInfo = styled.div`
  padding: 4rem 8rem 2rem 8rem;
  background: #1a1a1a;
  color: white;
  display: flex;
  justify-content: center;
  
  @media (max-width: 1200px) {
    padding: 4rem 6rem 2rem 6rem;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 2rem 1rem 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 1rem 0.5rem 1rem;
  }
`;

const ProjectSpecs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
  max-width: 800px;
  width: 100%;
  text-align: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 1rem;
    max-width: 100%;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
    margin-top: 0.5rem;
  }
`;

const SpecItem = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    opacity: 0.7;
  }
  p {
    font-size: 1.4rem;
  }
  
  @media (max-width: 768px) {
    h3 {
      font-size: 1rem;
      margin-bottom: 0.3rem;
    }
    p {
      font-size: 1.2rem;
    }
  }
  
  @media (max-width: 480px) {
    h3 {
      font-size: 0.9rem;
      margin-bottom: 0.2rem;
    }
    p {
      font-size: 1rem;
    }
  }
`;

const TextSection = styled.div`
  padding: 1rem 8rem;
  background: #1a1a1a;
  color: white;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  
  @media (max-width: 1200px) {
    padding: 1rem 6rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 2rem;
    max-width: 100%;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    line-height: 1.5;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    line-height: 1.4;
  }
`;



interface MinimapSection {
  id: string;
  name: string;
  height: number;
  thumbnail?: string;
  bgColor?: string;
  type: 'image' | 'content' | 'spacing';
}

const ScrollIndicator: React.FC<{ project: Project; containerRef: React.RefObject<HTMLDivElement | null> }> = ({ project, containerRef }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(20);

  // Calculate actual section heights based on real content
  const getActualSectionHeights = (): MinimapSection[] => {
    if (!containerRef.current) return [];
    
    const heroHeight = window.innerHeight; // 100vh
    const detailsHeight = 200; // Approximate details section height (4rem padding + content)
    const galleryHeight = window.innerHeight; // Each gallery image is 100vh
    const spacingHeight = 128; // 8rem margin between images (4rem top + 4rem bottom)
    
    // Total content includes spacing between gallery images
    const totalSpacing = project.galleryImages.length > 0 ? (project.galleryImages.length - 1) * spacingHeight : 0;
    const totalContentHeight = heroHeight + detailsHeight + (project.galleryImages.length * galleryHeight) + totalSpacing;
    
    const sections: MinimapSection[] = [
      {
        id: 'hero',
        name: 'Hero',
        height: (heroHeight / totalContentHeight) * 100,
        thumbnail: project.mainImage,
        type: 'image'
      },
      {
        id: 'info',
        name: 'Details',
        height: (detailsHeight / totalContentHeight) * 100,
        bgColor: '#1a1a1a',
        type: 'content'
      },
    ];

    // Add gallery images with spacing between them
    project.galleryImages.forEach((image, index) => {
      sections.push({
        id: `gallery-${index}`,
        name: `Image ${index + 1}`,
        height: (galleryHeight / totalContentHeight) * 100,
        thumbnail: image,
        type: 'image',
      });

      // Add spacing after each image except the last one
      if (index < project.galleryImages.length - 1) {
        sections.push({
          id: `spacing-${index}`,
          name: 'Spacing',
          height: (spacingHeight / totalContentHeight) * 100,
          bgColor: '#1a1a1a',
          type: 'spacing',
        });
      }
    });

    return sections;
  };

  const sections = getActualSectionHeights();

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const percentage = clickY / rect.height;
    
    if (containerRef.current) {
      const container = containerRef.current;
      const maxScroll = container.scrollHeight - container.clientHeight;
      const targetScroll = percentage * maxScroll;
      
      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScrollMetrics = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      
      // Calculate scroll position as percentage
      const scrollPercentage = maxScroll > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      // Calculate viewport height as percentage of total content
      const viewportPercentage = (clientHeight / scrollHeight) * 100;
      
      setScrollPosition(scrollPercentage);
      setViewportHeight(Math.min(viewportPercentage, 100));
    };

    container.addEventListener('scroll', updateScrollMetrics);
    container.addEventListener('resize', updateScrollMetrics);
    updateScrollMetrics(); // Initial calculation

    return () => {
      container.removeEventListener('scroll', updateScrollMetrics);
      container.removeEventListener('resize', updateScrollMetrics);
    };
  }, [containerRef, project.galleryImages.length]);

  // Calculate precise viewport indicator position
  const viewportTop = scrollPosition;

  return (
    <ScrollProgress
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
    >
      <PageMinimap>
        {sections.map((section) => (
          <SectionThumbnail key={section.id} height={section.height}>
            {section.type === 'image' ? (
              <ThumbnailImage 
                src={section.thumbnail} 
                alt={section.name}
              />
            ) : section.type === 'spacing' ? (
              <ThumbnailContent bgColor="transparent">
              </ThumbnailContent>
            ) : (
              <ThumbnailContent bgColor={section.bgColor}>
                Details
              </ThumbnailContent>
            )}
          </SectionThumbnail>
        ))}
        <ViewportIndicator
          style={{ 
            top: `${viewportTop}%`,
            height: `${viewportHeight}%`
          }}
          animate={{ 
            top: `${viewportTop}%`,
            height: `${viewportHeight}%`
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </PageMinimap>
    </ScrollProgress>
  );
};

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  year: string;
  size: string;
  mainImage: string;
  galleryImages: string[];
}

// This would typically come from your API or data source
const getProjectData = (id: string): Project => {
  if (id === "1") {
    return {
      id: 1,
      title: "Nova Loft",
      category: "Residential",
      description: "A modern residential development that redefines urban living through innovative design and sustainable architecture.",
      location: "Istanbul, Turkey",
      year: "2024",
      size: "12,000 m²",
      mainImage: "/DKCGROUPP/imagess/nova3.PNG",
      galleryImages: [
        "/DKCGROUPP/imagess/nova1.PNG",
        "/DKCGROUPP/imagess/nova2.PNG",
        "/DKCGROUPP/imagess/nova4.PNG",
        "/DKCGROUPP/imagess/nova5.PNG",
        "/DKCGROUPP/imagess/nova6.PNG"
      ]
    };
  }
  // Add other projects here
  return {
    id: parseInt(id),
    title: "Project",
    category: "Category",
    description: "Description",
    location: "Location",
    year: "Year",
    size: "Size",
    mainImage: "/DKCGROUPP/imagess/adva.PNG",
    galleryImages: []
  };
};

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = getProjectData(id || "1");
  const [showScroll, setShowScroll] = useState(false);
  const navigate = useNavigate();

  const heroRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const galleryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.scrollTo(0, 0);
    
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollY = container.scrollTop;
      const shouldShow = scrollY > heroHeight * 0.5; // Show at 50% of hero height
      setShowScroll(shouldShow);
      console.log('Scroll Y:', scrollY, 'Hero Height:', heroHeight, 'Should show:', shouldShow);
    };

    container.addEventListener('scroll', handleScroll);
    console.log('Scroll listener added to container'); // Debug log
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <ProjectContainer
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
        <BackArrow onClick={handleBack}>
          <ArrowIcon />
        </BackArrow>
        {showScroll && <ScrollIndicator project={project} containerRef={containerRef} />}
        <HeroSection ref={heroRef}>
          <HeroTitle>{project.title}</HeroTitle>
          {project.id === 1 && (
            <BeforeAfterSlider
              beforeImage="/DKCGROUPP/imagess/insaat.jpg"
              afterImage="/DKCGROUPP/imagess/nova3.PNG"
              beforeLabel="Before"
              afterLabel="After"
              initialPosition={0}
            />
          )}
        </HeroSection>

        <ProjectInfo ref={infoRef}>
          <ProjectSpecs>
            <SpecItem>
              <h3>Location</h3>
              <p>{project.location}</p>
            </SpecItem>
            <SpecItem>
              <h3>Year</h3>
              <p>{project.year}</p>
            </SpecItem>
            <SpecItem>
              <h3>Size</h3>
              <p>{project.size}</p>
            </SpecItem>
          </ProjectSpecs>
        </ProjectInfo>
        
        <GallerySection>
          {project.galleryImages.map((image, index) => (
            <React.Fragment key={`gallery-fragment-${index}-${project.id}`}>
              <ImageContainer 
                key={`gallery-image-${index}-${project.id}`}
                isFirst={index === 0}
                ref={(el) => {
                  galleryRefs.current[index] = el;
                }}
              >
                <GalleryImage
                  src={image}
                  alt={`${project.title} - Image ${index + 1}`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                />
              </ImageContainer>
              
              {/* Add text sections between images for Nova Loft project */}
              {project.id === 1 && index === 0 && (
                <TextSection>
                  <SectionDescription>
                    Nova Loft combines contemporary architecture with sustainable living principles. Each unit features open-concept layouts that maximize natural light and foster community interaction.
                  </SectionDescription>
                </TextSection>
              )}
              
              {project.id === 1 && index === 1 && (
                <TextSection>
                  <SectionDescription>
                    The building's distinctive facade merges glass and steel with warm wood accents. Floor-to-ceiling windows frame panoramic city views while ensuring optimal natural ventilation.
                  </SectionDescription>
                </TextSection>
              )}
              
              {project.id === 1 && index === 2 && (
                <TextSection>
                  <SectionDescription>
                    Premium amenities include a state-of-the-art fitness center and infinity pool with skyline views. Co-working spaces and 24/7 concierge services enhance the modern urban lifestyle.
                  </SectionDescription>
                </TextSection>
              )}
              
              {project.id === 1 && index === 3 && (
                <TextSection>
                  <SectionDescription>
                    Environmental responsibility drives Nova Loft's design with solar panels and geothermal heating. The building targets LEED Platinum certification while minimizing its environmental footprint.
                  </SectionDescription>
                </TextSection>
              )}
            </React.Fragment>
          ))}
        </GallerySection>
      </ProjectContainer>
  );
};

export default ProjectDetails; 