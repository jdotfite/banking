// lib/hooks/useContainerPosition.tsx
'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

interface ContainerPositionOptions {
  referenceRef: RefObject<HTMLElement>; // The element we position relative to
  containerRef: RefObject<HTMLElement>; // The container to position
  bottomOffset?: number; // Space for bottom navigation or other elements
  collapsedRatio?: number; // Ratio of available space for collapsed state
  expandedRatio?: number; // Ratio of available space for expanded state
}

interface ContainerPositionResult {
  collapsedHeight: number;
  expandedHeight: number;
  isCalculated: boolean;
  updatePosition: () => void;
}

export function useContainerPosition({
  referenceRef,
  containerRef,
  bottomOffset = 80,
  collapsedRatio = 0.7,
  expandedRatio = 0.9,
}: ContainerPositionOptions): ContainerPositionResult {
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const [isCalculated, setIsCalculated] = useState(false);

  // Function to calculate positioning
  const calculatePositioning = () => {
    if (!containerRef.current || !referenceRef.current) return;
    
    // Get the bottom position of the reference element (pay buttons)
    const referenceRect = referenceRef.current.getBoundingClientRect();
    const referenceBottom = referenceRect.bottom;
    
    // Set the top of the container to the bottom of the reference element
    if (containerRef.current) {
      containerRef.current.style.top = `${referenceBottom}px`;
    }
    
    // Update the height of the container
    const viewportHeight = window.innerHeight;
    
    const availableHeight = viewportHeight - referenceBottom - bottomOffset;
    const newCollapsedHeight = Math.min(availableHeight * collapsedRatio, availableHeight);
    const newExpandedHeight = Math.min(availableHeight * expandedRatio, availableHeight);
    
    // Update state
    setCollapsedHeight(newCollapsedHeight);
    setExpandedHeight(newExpandedHeight);
    setIsCalculated(true);
  };

  useEffect(() => {
    // Calculate on mount and when window is resized
    calculatePositioning();
    window.addEventListener('resize', calculatePositioning);
    
    // Also observe the reference element for any changes in height/position
    if (referenceRef.current) {
      const observer = new ResizeObserver(calculatePositioning);
      observer.observe(referenceRef.current);
      
      return () => {
        observer.disconnect();
        window.removeEventListener('resize', calculatePositioning);
      };
    }
    
    return () => window.removeEventListener('resize', calculatePositioning);
  }, [referenceRef, containerRef]);

  return {
    collapsedHeight,
    expandedHeight,
    isCalculated,
    updatePosition: calculatePositioning
  };
}

export default useContainerPosition;