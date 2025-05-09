'use client';

import React, { useState, useRef, useEffect } from 'react';

interface SimpleDraggableSheetProps {
  children: React.ReactNode;
  minHeight: number;
  maxHeight: number;
  initialHeight?: number;
}

const SimpleDraggableSheet: React.FC<SimpleDraggableSheetProps> = ({
  children,
  minHeight,
  maxHeight,
  initialHeight = minHeight,
}) => {
  const [height, setHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(initialHeight);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Handle drag start
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    startYRef.current = clientY;
    startHeightRef.current = height;
    setIsDragging(true);
  };

  // Handle drag move
  const handleTouchMove = (e: TouchEvent | MouseEvent) => {
    if (!isDragging) return;
    
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    const deltaY = startYRef.current - clientY;
    const newHeight = Math.min(maxHeight, Math.max(minHeight, startHeightRef.current + deltaY));
    
    setHeight(newHeight);
  };

  // Handle drag end
  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Snap to closest position (min or max)
    const midPoint = (minHeight + maxHeight) / 2;
    if (height < midPoint) {
      setHeight(minHeight);
    } else {
      setHeight(maxHeight);
    }
  };

  // Add and remove event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleTouchMove(e);
    const handleMouseUp = () => handleTouchEnd();
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <div 
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 bg-[#212121] rounded-t-xl transition-all duration-300 ease-in-out overflow-hidden
        md:left-1/2 md:transform md:-translate-x-1/2 md:max-w-md"
      style={{ 
        height: `${height}px`,
        transition: isDragging ? 'none' : 'height 0.3s ease'
      }}
    >
      {/* Drag handle */}
      <div 
        className="w-full flex justify-center py-2 cursor-grab"
        onTouchStart={handleTouchStart}
        onMouseDown={handleTouchStart}
      >
        <div className="w-10 h-1 bg-neutral-600 rounded-full"></div>
      </div>
      
      {/* Content */}
      <div className="overflow-y-auto h-[calc(100%-24px)]">
        {children}
      </div>
    </div>
  );
};

export default SimpleDraggableSheet;