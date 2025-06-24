import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SliderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 1.5rem;
  padding: 2rem 0;
  
  @media (max-width: 768px) {
    gap: 1rem;
    padding: 1.5rem 0;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
    padding: 1rem 0;
  }
`;

const SideLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;
  min-width: 120px;
  
  @media (max-width: 768px) {
    min-width: 100px;
  }
  
  @media (max-width: 480px) {
    min-width: 80px;
  }
`;

const LabelTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    letter-spacing: 1.5px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    letter-spacing: 1px;
  }
`;

const SliderContainer = styled.div`
  position: relative;
  width: 700px;
  height: 400px;
  overflow: visible;
  cursor: col-resize;
  user-select: none;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    width: 575px;
    height: 350px;
    border-radius: 6px;
    cursor: grab;
    
    &:active {
      cursor: grabbing;
    }
  }
  
  @media (max-width: 480px) {
    width: 350px;
    height: 250px;
    border-radius: 4px;
  }
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 50px;
  width: 600px;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    left: 37.5px;
    width: 500px;
    border-radius: 6px;
  }
  
  @media (max-width: 480px) {
    left: 25px;
    width: 300px;
    border-radius: 4px;
  }
`;

const BeforeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const AfterImageContainer = styled.div<{ clipWidth: number }>`
  position: absolute;
  top: 0;
  left: 50px;
  width: 600px;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
  clip-path: inset(0 ${props => {
    // Convert the full container percentage to image-relative percentage
    const imageStartPercent = (50 / 700) * 100; // ~7.14%
    const imageEndPercent = (650 / 700) * 100; // ~92.86%
    
    if (props.clipWidth <= imageStartPercent) {
      return '100%';
    } else if (props.clipWidth >= imageEndPercent) {
      return '0%';
    } else {
      const imageRelativePercent = (props.clipWidth - imageStartPercent) / (imageEndPercent - imageStartPercent) * 100;
      return (100 - imageRelativePercent) + '%';
    }
  }} 0 0);
  
  @media (max-width: 768px) {
    left: 37.5px;
    width: 500px;
    border-radius: 6px;
    clip-path: inset(0 ${props => {
      const imageStartPercent = (37.5 / 575) * 100;
      const imageEndPercent = (537.5 / 575) * 100;
      
      if (props.clipWidth <= imageStartPercent) {
        return '100%';
      } else if (props.clipWidth >= imageEndPercent) {
        return '0%';
      } else {
        const imageRelativePercent = (props.clipWidth - imageStartPercent) / (imageEndPercent - imageStartPercent) * 100;
        return (100 - imageRelativePercent) + '%';
      }
    }} 0 0);
  }
  
  @media (max-width: 480px) {
    left: 25px;
    width: 300px;
    border-radius: 4px;
    clip-path: inset(0 ${props => {
      const imageStartPercent = (25 / 350) * 100;
      const imageEndPercent = (325 / 350) * 100;
      
      if (props.clipWidth <= imageStartPercent) {
        return '100%';
      } else if (props.clipWidth >= imageEndPercent) {
        return '0%';
      } else {
        const imageRelativePercent = (props.clipWidth - imageStartPercent) / (imageEndPercent - imageStartPercent) * 100;
        return (100 - imageRelativePercent) + '%';
      }
    }} 0 0);
  }
`;

const AfterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DividerLine = styled(motion.div)<{ position: number }>`
  position: absolute;
  top: -30px;
  left: calc(${props => props.position}% - 2px);
  width: 4px;
  height: calc(100% + 60px);
  background: linear-gradient(to bottom, 
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0.9) 100%
  );
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  z-index: 10;
  cursor: col-resize;
  pointer-events: none;
  
  @media (max-width: 768px) {
    width: 3px;
    top: -20px;
    height: calc(100% + 40px);
    left: calc(${props => props.position}% - 1.5px);
  }
  
  @media (max-width: 480px) {
    width: 2px;
    top: -15px;
    height: calc(100% + 30px);
    left: calc(${props => props.position}% - 1px);
  }
`;

const DragHandle = styled(motion.div)<{ position: number }>`
  position: absolute;
  top: 45%;
  left: calc(${props => props.position}% - 20px);
  transform: translate(0, -50%);
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  cursor: col-resize;
  z-index: 11;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border: solid #333;
    border-width: 0 2px 2px 0;
  }
  
  &::before {
    transform: rotate(-45deg);
    left: 12px;
  }
  
  &::after {
    transform: rotate(135deg);
    right: 12px;
  }
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    cursor: grab;
    
    &:active {
      cursor: grabbing;
    }
    
    &::before,
    &::after {
      width: 6px;
      height: 6px;
      border-width: 0 1.5px 1.5px 0;
    }
    
    &::before {
      left: 11px;
    }
    
    &::after {
      right: 11px;
    }
  }
  
  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    
    &::before,
    &::after {
      width: 5px;
      height: 5px;
      border-width: 0 1px 1px 0;
    }
    
    &::before {
      left: 9px;
    }
    
    &::after {
      right: 9px;
    }
  }
`;

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  initialPosition = 50
}) => {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    e.preventDefault(); // Prevent scrolling while dragging
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  return (
    <SliderWrapper>
      <SideLabel>
        <LabelTitle>{beforeLabel}</LabelTitle>
      </SideLabel>
      
      <SliderContainer ref={containerRef} onClick={handleContainerClick}>
        <ImageWrapper>
          <BeforeImage src={beforeImage} alt="Before" draggable={false} />
        </ImageWrapper>
        
        <AfterImageContainer clipWidth={sliderPosition}>
          <AfterImage src={afterImage} alt="After" draggable={false} />
        </AfterImageContainer>
        
        <DividerLine
          position={sliderPosition}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
        
        <DragHandle
          position={sliderPosition}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        />
      </SliderContainer>
      
      <SideLabel>
        <LabelTitle>{afterLabel}</LabelTitle>
      </SideLabel>
    </SliderWrapper>
  );
};

export default BeforeAfterSlider; 