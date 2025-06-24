import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SliderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 3rem;
  padding: 2rem 0;
  
  @media (max-width: 768px) {
    gap: 2rem;
    padding: 1.5rem 0;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
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
  width: 600px;
  height: 400px;
  overflow: visible;
  cursor: col-resize;
  user-select: none;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    width: 500px;
    height: 350px;
    border-radius: 6px;
    cursor: grab;
    
    &:active {
      cursor: grabbing;
    }
  }
  
  @media (max-width: 480px) {
    width: 300px;
    height: 250px;
    border-radius: 4px;
  }
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    border-radius: 6px;
  }
  
  @media (max-width: 480px) {
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
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
  clip-path: inset(0 ${props => {
    const adjustedPosition = Math.max(0, Math.min(100, props.clipWidth - 8.33));
    return Math.max(0, 100 - adjustedPosition) + '%';
  }} 0 0);
  
  @media (max-width: 768px) {
    border-radius: 6px;
    clip-path: inset(0 ${props => {
      const adjustedPosition = Math.max(0, Math.min(100, props.clipWidth - 8));
      return Math.max(0, 100 - adjustedPosition) + '%';
    }} 0 0);
  }
  
  @media (max-width: 480px) {
    border-radius: 4px;
    clip-path: inset(0 ${props => {
      const adjustedPosition = Math.max(0, Math.min(100, props.clipWidth - 10));
      return Math.max(0, 100 - adjustedPosition) + '%';
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
  left: calc(${props => props.position}% - 50px);
  width: 8px;
  height: calc(100% + 60px);
  background: linear-gradient(to bottom, 
    rgba(255, 0, 0, 0.9) 0%,
    rgba(255, 0, 0, 1) 50%,
    rgba(255, 0, 0, 0.9) 100%
  );
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  z-index: 10;
  cursor: col-resize;
  
  @media (max-width: 768px) {
    width: 3px;
    top: -20px;
    height: calc(100% + 40px);
    left: calc(${props => props.position}% - 40px);
    cursor: grab;
    
    &:active {
      cursor: grabbing;
    }
  }
  
  @media (max-width: 480px) {
    width: 2px;
    top: -15px;
    height: calc(100% + 30px);
    left: calc(${props => props.position}% - 30px);
  }
`;

const DragHandle = styled(motion.div)<{ position: number }>`
  position: absolute;
  top: 50%;
  left: calc(${props => props.position}% - 50px);
  transform: translate(-50%, -50%);
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
    left: calc(${props => props.position}% - 40px);
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
    left: calc(${props => props.position}% - 30px);
    
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
  const [sliderPosition, setSliderPosition] = useState(25); // Start at 25% to test changes are working
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + 50;
    const percentage = Math.max(0, Math.min(117, (x / rect.width) * 100));
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
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left + 50;
    const percentage = Math.max(0, Math.min(117, (x / rect.width) * 100));
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
    const x = e.clientX - rect.left + 50;
    const percentage = Math.max(0, Math.min(117, (x / rect.width) * 100));
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