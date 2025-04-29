'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';

interface CustomBottomSheetProps {
  children: React.ReactNode;
  snapPoints: number[];
  defaultSnap?: number;
  expandOnContentDrag?: boolean;
  onSnap?: (index: number) => void;
}

const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({
  children,
  snapPoints,
  defaultSnap = 0,
  expandOnContentDrag = false,
  onSnap,
}) => {
  const [currentSnap, setCurrentSnap] = useState(defaultSnap);
  const [isDragging, setIsDragging] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  
  // Update height whenever snap changes
  useEffect(() => {
    if (snapPoints && snapPoints.length > currentSnap) {
      y.set(0); // Reset drag position
    }
  }, [currentSnap, snapPoints, y]);

  // Find closest snap point on drag end
  const findClosestSnapPoint = (dragY: number) => {
    if (!snapPoints || snapPoints.length === 0) return 0;
    
    // Current position is the current snap point minus the drag amount
    const currentHeight = snapPoints[currentSnap];
    const targetHeight = currentHeight - dragY;
    
    // Find the closest snap point to the target height
    let closestIndex = 0;
    let closestDistance = Math.abs(snapPoints[0] - targetHeight);
    
    snapPoints.forEach((snap, index) => {
      const distance = Math.abs(snap - targetHeight);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    
    return closestIndex;
  };

  const handleDragEnd = (event: any, info: any) => {
    // Find closest snap point based on drag velocity and position
    const newSnapIndex = findClosestSnapPoint(info.offset.y);
    setCurrentSnap(newSnapIndex);
    
    if (onSnap) {
      onSnap(newSnapIndex);
    }
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-app-darkGray rounded-t-2xl shadow-lg z-10 overflow-hidden
                md:left-1/2 md:transform md:-translate-x-1/2 md:max-w-md"
      style={{ height: snapPoints[currentSnap] || 300 }}
      initial={{ height: snapPoints[defaultSnap] || 300 }}
      animate={{ height: snapPoints[currentSnap] || 300 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      {/* Drag handle */}
      <motion.div 
        className="drag-handle-container cursor-grab active:cursor-grabbing"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(e, info) => {
          setIsDragging(false);
          handleDragEnd(e, info);
        }}
        style={{ y }}
      >
        <div className="drag-handle"></div>
      </motion.div>
      
      {/* Content */}
      <motion.div 
        ref={contentRef}
        className="overflow-y-auto max-h-full"
        drag={expandOnContentDrag ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={() => expandOnContentDrag && setIsDragging(true)}
        onDragEnd={(e, info) => {
          if (expandOnContentDrag) {
            setIsDragging(false);
            handleDragEnd(e, info);
          }
        }}
        style={{ touchAction: expandOnContentDrag ? 'none' : 'auto' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default CustomBottomSheet;