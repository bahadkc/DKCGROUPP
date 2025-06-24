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
    min-width: 80px;
  }
  
  @media (max-width: 480px) {
    min-width: 60px;
  }
`;

const LabelTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  
  @media (max-width: 768px) {
    font-size: 1rem;
    letter-spacing: 1px;
    margin-bottom: 0.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    letter-spacing: 0.5px;
  }
  
  @media (max-width: 320px) {
    font-size: 0.8rem;
    letter-spacing: 0.25px;
  }
`;

const SliderContainer = styled.div`
  position: relative;
  width: 600px;
  height: 350px;
  overflow: visible;
  cursor: col-resize;
  user-select: none;
  border-radius: 8px;
  touch-action: pan-x;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    width: 400px;
    height: 240px;
    border-radius: 6px;
    cursor: grab;
    
    &:active {
      cursor: grabbing;
    }
  }
  
  @media (max-width: 480px) {
    width: 280px;
    height: 180px;
    border-radius: 4px;
  }
  
  @media (max-width: 320px) {
    width: 240px;
    height: 150px;
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
  clip-path: inset(0 ${props => (100 - props.clipWidth)}% 0 0);
  
  @media (max-width: 768px) {
    border-radius: 6px;
  }
  
  @media (max-width: 480px) {
    border-radius: 4px;
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
    top: -25px;
    height: calc(100% + 50px);
    left: calc(${props => props.position}% - 1.5px);
    cursor: grab;
  }
  
  @media (max-width: 480px) {
    width: 2px;
    top: -20px;
    height: calc(100% + 40px);
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
    width: 45px;
    height: 45px;
    cursor: grab;
    left: calc(${props => props.position}% - 22.5px);
    
    &:active {
      cursor: grabbing;
    }
    
    &::before,
    &::after {
      width: 8px;
      height: 8px;
      border-width: 0 2px 2px 0;
    }
    
    &::before {
      left: 14px;
    }
    
    &::after {
      right: 14px;
    }
  }
  
  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
    left: calc(${props => props.position}% - 17.5px);
    
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
  
  @media (max-width: 320px) {
    width: 30px;
    height: 30px;
    left: calc(${props => props.position}% - 15px);
    
    &::before,
    &::after {
      width: 5px;
      height: 5px;
      border-width: 0 1px 1px 0;
    }
    
    &::before {
      left: 10px;
    }
    
    &::after {
      right: 10px;
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
  initialPosition = 0
}) => {
  const [sliderPosition, setSliderPosition] = useState(0); // Start at leftmost boundary
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get responsive extension based on screen size
  const getResponsiveExtension = useCallback(() => {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 320) return 10; // Small mobile
    if (screenWidth <= 480) return 15; // Mobile
    if (screenWidth <= 768) return 20; // Tablet
    return 30; // Desktop
  }, []);

  // Convert gap-relative position to image-relative position for clipping
  const getImageClipPosition = useCallback(() => {
    if (!containerRef.current) return sliderPosition;
    
    const sliderWrapper = containerRef.current.parentElement;
    if (!sliderWrapper) return sliderPosition;
    
    const wrapperRect = sliderWrapper.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate boundaries
    const imageStartX = containerRect.left - wrapperRect.left;
    const imageEndX = containerRect.right - wrapperRect.left;
    const imageWidth = containerRect.width;
    const wrapperWidth = wrapperRect.width;
    
    // Extend boundaries by responsive amount beyond image edges  
    const extension = getResponsiveExtension();
    const extendedStartX = imageStartX - extension;
    const extendedEndX = imageEndX + extension;
    
    // Calculate extended gap boundaries as percentages
    const leftGapPercentage = (extendedStartX / wrapperWidth) * 100;
    const rightGapPercentage = (extendedEndX / wrapperWidth) * 100;
    
    // Convert slider position (0-100% of gap range) to wrapper percentage
    const gapRangePercentage = leftGapPercentage + (sliderPosition / 100) * (rightGapPercentage - leftGapPercentage);
    
    // Convert wrapper percentage to image-relative percentage
    const wrapperPixelPosition = (gapRangePercentage / 100) * wrapperWidth;
    const imagePixelPosition = wrapperPixelPosition - imageStartX;
    const imageRelativePercentage = (imagePixelPosition / imageWidth) * 100;
    
    return imageRelativePercentage;
  }, [sliderPosition, getResponsiveExtension]);

  // Convert gap-relative position to container-relative position for visual elements
  const getContainerRelativePosition = useCallback(() => {
    if (!containerRef.current) return sliderPosition;
    
    const sliderWrapper = containerRef.current.parentElement;
    if (!sliderWrapper) return sliderPosition;
    
    const wrapperRect = sliderWrapper.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate boundaries
    const imageStartX = containerRect.left - wrapperRect.left;
    const imageEndX = containerRect.right - wrapperRect.left;
    const imageWidth = containerRect.width;
    const wrapperWidth = wrapperRect.width;
    
    // Extend boundaries by responsive amount beyond image edges  
    const extension = getResponsiveExtension();
    const extendedStartX = imageStartX - extension;
    const extendedEndX = imageEndX + extension;
    
    // Calculate extended gap boundaries as percentages
    const leftGapPercentage = (extendedStartX / wrapperWidth) * 100;
    const rightGapPercentage = (extendedEndX / wrapperWidth) * 100;
    
    // Convert slider position (0-100% of gap range) to wrapper percentage
    const gapRangePercentage = leftGapPercentage + (sliderPosition / 100) * (rightGapPercentage - leftGapPercentage);
    
    // Convert wrapper percentage to container-relative percentage
    const wrapperPixelPosition = (gapRangePercentage / 100) * wrapperWidth;
    const containerPixelPosition = wrapperPixelPosition - imageStartX;
    const containerRelativePercentage = (containerPixelPosition / imageWidth) * 100;
    
          return containerRelativePercentage;
    }, [sliderPosition, getResponsiveExtension]);

    const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const sliderWrapper = containerRef.current.parentElement;
    if (!sliderWrapper) return;
    
    const wrapperRect = sliderWrapper.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate the position relative to the entire wrapper (including labels)
    const x = clientX - wrapperRect.left;
    
    // Calculate the actual gap boundaries
    const imageStartX = containerRect.left - wrapperRect.left;
    const imageEndX = containerRect.right - wrapperRect.left;
    const totalWrapperWidth = wrapperRect.width;
    
    // Extend boundaries by responsive amount beyond image edges
    const extension = getResponsiveExtension();
    const extendedStartX = imageStartX - extension;
    const extendedEndX = imageEndX + extension;
    
    // Define the extended gap boundaries as percentages of wrapper width
    const leftGapPercentage = (extendedStartX / totalWrapperWidth) * 100;
    const rightGapPercentage = (extendedEndX / totalWrapperWidth) * 100;
    
    // Convert mouse position to percentage
    const mousePercentage = (x / totalWrapperWidth) * 100;
    
    // Constrain mouse position to only be within the gap boundaries
    const constrainedPercentage = Math.max(leftGapPercentage, Math.min(rightGapPercentage, mousePercentage));
    
    // Map the constrained range to 0-100% for our slider
    const normalizedPercentage = ((constrainedPercentage - leftGapPercentage) / (rightGapPercentage - leftGapPercentage)) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, normalizedPercentage)));
  }, [getResponsiveExtension]);

  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true);
    updateSliderPosition(clientX);
  }, [updateSliderPosition]);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    updateSliderPosition(clientX);
  }, [isDragging, updateSliderPosition]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  }, [handleStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches[0]) {
      handleStart(e.touches[0].clientX);
    }
  }, [handleStart]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    if (isDragging && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  }, [isDragging, handleMove]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    handleEnd();
  }, [handleEnd]);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (isDragging) return;
    updateSliderPosition(e.clientX);
  }, [isDragging, updateSliderPosition]);

  const handleContainerTouch = useCallback((e: React.TouchEvent) => {
    if (e.touches[0] && !isDragging) {
      updateSliderPosition(e.touches[0].clientX);
    }
  }, [isDragging, updateSliderPosition]);

  return (
    <SliderWrapper>
      <SideLabel>
        <LabelTitle>{beforeLabel}</LabelTitle>
      </SideLabel>
      
      <SliderContainer 
        ref={containerRef} 
        onClick={handleContainerClick}
        onTouchStart={handleContainerTouch}
      >
        <ImageWrapper>
          <BeforeImage src={beforeImage} alt="Before" draggable={false} />
        </ImageWrapper>
        
        <AfterImageContainer clipWidth={getImageClipPosition()}>
          <AfterImage src={afterImage} alt="After" draggable={false} />
        </AfterImageContainer>
        
        <DividerLine
          position={getContainerRelativePosition()}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
        
        <DragHandle
          position={getContainerRelativePosition()}
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