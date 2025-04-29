'use client';

import { useState, useRef, useEffect } from 'react';

interface UseSwipeableContainerOptions {
  initialHeight: number;
  maxHeight: number;
  minHeight: number;
  snapPoints?: number[];
}

export const useSwipeableContainer = ({
  initialHeight,
  maxHeight,
  minHeight,
  snapPoints = [],
}: UseSwipeableContainerOptions) => {
  const [height, setHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const startHeightRef = useRef<number>(initialHeight);

  const handleDragStart = (clientY: number) => {
    startYRef.current = clientY;
    startHeightRef.current = height;
    setIsDragging(true);
    
    // Add a class to the body to prevent scrolling while dragging
    document.body.classList.add('overflow-hidden');
  };

  const handleDrag = (clientY: number) => {
    if (!isDragging || startYRef.current === null) {
      return;
    }

    const deltaY = startYRef.current - clientY;
    const newHeight = Math.min(maxHeight, Math.max(minHeight, startHeightRef.current + deltaY));
    setHeight(newHeight);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    startYRef.current = null;
    
    // Remove the class from the body
    document.body.classList.remove('overflow-hidden');

    // Find the closest snap point, including min and max
    const allSnapPoints = [...snapPoints, minHeight, maxHeight];
    
    if (allSnapPoints.length > 0) {
      const closestSnapPoint = allSnapPoints.reduce((prev, curr) => {
        return Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev;
      });
      
      // Animate to the snap point
      setHeight(closestSnapPoint);
    }
  };

  // Add a function to programmatically set the container height to a specific snap point
  const snapTo = (snapPoint: number) => {
    const validSnapPoint = Math.min(maxHeight, Math.max(minHeight, snapPoint));
    setHeight(validSnapPoint);
  };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const handle = containerRef.current?.querySelector('.drag-handle');
      if (handle && e.target instanceof Node && handle.contains(e.target)) {
        e.preventDefault(); // Prevent default to avoid scroll interference
        handleDragStart(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault(); // Prevent scrolling while dragging
        handleDrag(e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    // Mouse events for desktop support
    const handleMouseDown = (e: MouseEvent) => {
      const handle = containerRef.current?.querySelector('.drag-handle');
      if (handle && e.target instanceof Node && handle.contains(e.target)) {
        handleDragStart(e.clientY);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDrag(e.clientY);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    // Touch events
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    // Mouse events
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      // Clean up touch events
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);

      // Clean up mouse events
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, height, minHeight, maxHeight]);

  return { containerRef, height, isDragging, snapTo };
};
