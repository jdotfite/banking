import React, { useEffect, useState, useRef, useCallback } from 'react';
import { animated, useSpring } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { createPortal } from 'react-dom';

// Generic Reusable Bottom Sheet Component
export interface CustomBottomSheetProps {
  open: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  header?: string;
  className?: string;
  maxHeight?: number;
  theme?: 'light' | 'dark';
  snapPoints?: number[];
  initialSnap?: number;
  onSnap?: (index: number) => void;
}

export const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({ 
  open, 
  onDismiss, 
  children, 
  header,
  className = '',
  maxHeight = 600,
  theme = 'light',
  snapPoints = [maxHeight],
  initialSnap = 0,
  onSnap
}) => {
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(initialSnap);
  const [isDismissing, setIsDismissing] = useState(false);
  
  // Ensure we're mounted before using window or document
  useEffect(() => {
    setMounted(true);
  }, []);

  // Convert snap points to percentages for easier calculation
  const getSnapPercentage = useCallback((snapIndex: number) => {
    const snapHeight = snapPoints[snapIndex] || maxHeight;
    return ((maxHeight - snapHeight) / maxHeight) * 100;
  }, [snapPoints, maxHeight]);

  const [{ y, opacity }, api] = useSpring(() => ({ 
    y: 100, // Start at 100% (fully hidden below screen)
    opacity: 0
  }));

  // Handle opening/closing animation with proper snap point support
  useEffect(() => {
    if (mounted) {
      if (open && !isDismissing) {
        // Opening animation
        api.start({
          y: getSnapPercentage(currentSnapIndex),
          opacity: 1,
          config: { tension: 280, friction: 30 }
        });
      } else if (!open || isDismissing) {
        // Closing animation
        api.start({
          y: 100,
          opacity: 0,
          config: { tension: 280, friction: 30 },
          onRest: () => {
            if (isDismissing) {
              setIsDismissing(false);
              onDismiss();
            }
          }
        });
      }
    }
  }, [open, api, mounted, currentSnapIndex, getSnapPercentage, isDismissing, onDismiss]);

  // Smooth dismiss function
  const handleDismiss = useCallback(() => {
    if (!isDismissing) {
      setIsDismissing(true);
    }
  }, [isDismissing]);

  // Find closest snap point
  const findClosestSnapPoint = useCallback((currentY: number) => {
    let closestIndex = 0;
    let minDistance = Math.abs(currentY - getSnapPercentage(0));
    
    for (let i = 1; i < snapPoints.length; i++) {
      const distance = Math.abs(currentY - getSnapPercentage(i));
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  }, [snapPoints, getSnapPercentage]);

  // Check if content can scroll
  const canContentScroll = useCallback((direction: 'up' | 'down') => {
    if (!contentRef.current) return false;
    
    const element = contentRef.current;
    const { scrollTop, scrollHeight, clientHeight } = element;
    
    // Add some tolerance for rounding errors and better reliability
    const tolerance = 1;
    
    if (direction === 'up') {
      return scrollTop > tolerance;
    } else {
      return scrollTop < (scrollHeight - clientHeight - tolerance);
    }
  }, []);

  // Simplified and more reliable drag gestures
  const bind = useDrag(
    ({ last, velocity: [, vy], direction: [, dy], movement: [, my], cancel, event }) => {
      if (!mounted || isDismissing) return;
      
      const target = event?.target as HTMLElement;
      const isOnHandle = target?.closest('.drag-handle');
      const isOnContent = target?.closest('.sheet-content');
      
      // Always allow dragging on the handle
      if (isOnHandle) {
        // Handle dragging - always allowed
      } else if (isOnContent) {
        // Content dragging - check scroll position
        const isDragDown = my > 0;
        const isDragUp = my < 0;
        
        // If dragging down, only allow if at top of scroll
        if (isDragDown && canContentScroll('up')) {
          cancel();
          return;
        }
        
        // If dragging up, only allow if at bottom of scroll  
        if (isDragUp && canContentScroll('down')) {
          cancel();
          return;
        }
      }
      
      if (last) {
        // Gesture ended - determine behavior
        const velocityThreshold = 300; // Lower threshold for easier dismissal
        const dragThreshold = maxHeight * 0.25; // 25% of sheet height to dismiss
        
        // Check if should dismiss (fast swipe down or dragged far down)
        if ((Math.abs(vy) > velocityThreshold && dy > 0) || my > dragThreshold) {
          handleDismiss();
          return;
        }
        
        // Calculate current position as percentage
        const currentY = getSnapPercentage(currentSnapIndex) + (my / maxHeight) * 100;
        const targetSnapIndex = findClosestSnapPoint(currentY);
        
        if (targetSnapIndex !== currentSnapIndex) {
          setCurrentSnapIndex(targetSnapIndex);
          onSnap?.(targetSnapIndex);
        }
        
        // Animate to the snap point
        api.start({
          y: getSnapPercentage(targetSnapIndex),
          config: { 
            tension: 280, 
            friction: 25
          }
        });
      } else {
        // Follow drag movement
        const currentSnapY = getSnapPercentage(currentSnapIndex);
        const draggedY = currentSnapY + (my / maxHeight) * 100;
        
        // Allow some overshoot but limit it
        const minY = Math.max(-10, currentSnapY - 50); // Allow upward overshoot
        const maxY = Math.min(120, draggedY); // Allow downward overshoot
        
        const clampedY = Math.max(minY, Math.min(maxY, draggedY));
        
        api.start({ 
          y: clampedY,
          immediate: true
        });
      }
    },
    { 
      axis: 'y',
      pointer: { touch: true },
      filterTaps: true,
      threshold: 5 // Lower threshold for more responsive dragging
    }
  );

  // Handle backdrop click with smooth animation
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleDismiss();
    }
  }, [handleDismiss]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && !isDismissing) {
        handleDismiss();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling when bottom sheet is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, handleDismiss, isDismissing]);

  if (!open || !mounted) return null;

  // Theme-based styling
  const isDark = theme === 'dark';
  const handleClass = isDark ? 'bg-neutral-500' : 'bg-gray-300';
  const headerClass = isDark ? 'border-neutral-700 text-white' : 'border-gray-200 text-gray-900';

  const bottomSheetContent = (
    <div 
      className="bottom-sheet-portal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2147483647,
        pointerEvents: open ? 'auto' : 'none',
        transform: 'translateZ(0)',
        willChange: 'transform',
        isolation: 'isolate'
      }}
    >
      {/* Backdrop with fade animation */}
      <animated.div 
        className="backdrop"
        onClick={handleBackdropClick}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: opacity,
          touchAction: 'none'
        }}
      />
        
      {/* Bottom Sheet */}
      <animated.div
        ref={sheetRef}
        {...bind()}
        style={{
          touchAction: 'none',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          transform: y.to((py) => `translateY(${py}%)`),
          willChange: 'transform',
          maxHeight: `${maxHeight}px`,
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          backgroundColor: isDark ? '#212121' : '#ffffff',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
          userSelect: 'none'
        }}
        className={className}
      >
        {/* Drag Handle */}
        <div className="drag-handle flex justify-center py-3 cursor-grab active:cursor-grabbing">
          <div className={`w-10 h-1.5 ${handleClass} rounded-full transition-colors`} />
        </div>
        
        {/* Header */}
        {header && (
          <div className={`px-4 py-3 border-b ${headerClass}`}>
            <h3 className="text-lg font-medium text-center">{header}</h3>
          </div>
        )}
          
        {/* Content */}
        <div 
          ref={contentRef}
          className="sheet-content overflow-y-auto" 
          style={{ 
            touchAction: 'pan-y',
            maxHeight: header ? `${maxHeight - 120}px` : `${maxHeight - 80}px`,
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {children}
        </div>
      </animated.div>
    </div>
  );
  
  return createPortal(bottomSheetContent, document.body);
};
