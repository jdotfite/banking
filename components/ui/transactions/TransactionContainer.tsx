'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import TransactionList from './TransactionList';
import { TransactionDateGroup } from '@/lib/types';

interface TransactionContainerProps {
  transactionGroups: TransactionDateGroup[];
  buttonBottomPosition: number;
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

const TransactionContainer: React.FC<TransactionContainerProps> = ({ 
  transactionGroups,
  buttonBottomPosition,
  isCollapsed = false,
  onCollapseChange
}) => {
  // Track internal view state
  const [viewMode, setViewMode] = useState<'collapsed' | 'default' | 'fullscreen'>(
    isCollapsed ? 'collapsed' : 'default'
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const pendingStateChangeRef = useRef<'collapsed' | 'default' | 'fullscreen' | null>(null);
  
  // Heights for each state
  const [collapsedHeight, setCollapsedHeight] = useState(80); // Just enough for header
  const [defaultHeight, setDefaultHeight] = useState(500);
  const [fullscreenHeight, setFullscreenHeight] = useState(window.innerHeight);
  const [navbarHeight] = useState(64); // Bottom navigation height
  
  // Synchronize with parent's collapsed state, but only when not dragging
  useEffect(() => {
    if (!isDraggingRef.current && !isAnimatingRef.current) {
      if (isCollapsed && viewMode !== 'collapsed') {
        setViewMode('collapsed');
      } else if (!isCollapsed && viewMode === 'collapsed') {
        setViewMode('default');
      }
    }
  }, [isCollapsed, viewMode]);
  
  // Calculate heights based on content position
  useEffect(() => {
    if (buttonBottomPosition <= 0) return;
    
    const calculateHeights = () => {
      const viewportHeight = window.innerHeight;
      
      // Calculate the available space between buttons and navbar
      const availableHeight = viewportHeight - buttonBottomPosition - navbarHeight;
      
      // Collapsed height - just enough for title and drag handle
      const calculatedCollapsedHeight = 80;
      
      // Default height - uses most of available space
      const calculatedDefaultHeight = Math.max(
        availableHeight - 20, // Leave a small gap
        Math.min(availableHeight * 0.95, 400) // Ensure minimum height
      );
      
      // Fullscreen - covers from top of viewport to navbar
      const calculatedFullscreenHeight = viewportHeight - navbarHeight;
      
      setCollapsedHeight(calculatedCollapsedHeight);
      setDefaultHeight(calculatedDefaultHeight);
      setFullscreenHeight(calculatedFullscreenHeight);
    };
    
    calculateHeights();
    window.addEventListener('resize', calculateHeights);
    return () => window.removeEventListener('resize', calculateHeights);
  }, [buttonBottomPosition, navbarHeight]);
  
  // Get current height based on view mode
  const getCurrentHeight = (mode = viewMode) => {
    switch (mode) {
      case 'collapsed': return collapsedHeight;
      case 'default': return defaultHeight;
      case 'fullscreen': return fullscreenHeight;
    }
  };
  
  // Apply state change after animation completes
  const applyPendingStateChange = () => {
    if (pendingStateChangeRef.current) {
      setViewMode(pendingStateChangeRef.current);
      pendingStateChangeRef.current = null;
    }
  };
  
  // Set up spring animation
  const [{ height }, api] = useSpring(() => ({
    from: { height: isCollapsed ? collapsedHeight : defaultHeight },
    to: { height: isCollapsed ? collapsedHeight : defaultHeight },
    config: { mass: 1, tension: 280, friction: 25 },
    immediate: false,
    onRest: () => {
      isAnimatingRef.current = false;
      applyPendingStateChange();
      
      // Notify parent about collapse state changes
      if (onCollapseChange && (viewMode === 'collapsed') !== isCollapsed) {
        onCollapseChange(viewMode === 'collapsed');
      }
    }
  }));
  
  // Update spring when view mode or heights change
  useEffect(() => {
    if (isDraggingRef.current) return;
    
    const targetHeight = getCurrentHeight();
    if (targetHeight > 0) {
      isAnimatingRef.current = true;
      
      api.start({ 
        height: targetHeight,
        immediate: false,
        config: { mass: 1, tension: 280, friction: 25 }
      });
    }
  }, [viewMode, collapsedHeight, defaultHeight, fullscreenHeight, api]);
  
  // Handle expand button click (from collapsed state)
  const handleExpandClick = () => {
    if (isAnimatingRef.current) return;
    
    // When expanding from collapsed, always go to default view (not fullscreen)
    setViewMode('default');
  };
  
  // Handle fullscreen toggle (from default state)
  const handleFullscreenToggle = () => {
    if (isAnimatingRef.current) return;
    
    setViewMode(viewMode === 'fullscreen' ? 'default' : 'fullscreen');
  };
  
  // Set up drag gesture
  const bind = useDrag(({ movement: [_, my], last, velocity, first, active }) => {
    // Handle drag start
    if (first) {
      isDraggingRef.current = true;
      pendingStateChangeRef.current = null;
    }
    
    // During active drag
    if (active && !last) {
      // Calculate new height based on drag
      const currentHeight = getCurrentHeight();
      const newHeight = currentHeight - my;
      const minHeight = collapsedHeight - 5;
      const maxHeight = fullscreenHeight + 5;
      
      // Apply constraints and update immediately
      const constrainedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
      api.start({
        height: constrainedHeight,
        immediate: true
      });
    }
    
    // Handle drag end
    if (last) {
      // Calculate velocity and thresholds
      const [, vy] = velocity;
      const isFlick = Math.abs(vy) > 0.5;
      const dragThreshold = isFlick ? 20 : 60;
      
      // Determine target state based on current state, drag distance and velocity
      let targetMode = viewMode;
      
      if (viewMode === 'fullscreen') {
        // From fullscreen, dragging down
        if (my > dragThreshold) {
          targetMode = my > 150 || vy > 1 ? 'collapsed' : 'default';
        }
      } else if (viewMode === 'default') {
        // From default, dragging up or down
        if (my < -dragThreshold || vy < -0.5) {
          targetMode = 'fullscreen';
        } else if (my > dragThreshold || vy > 0.5) {
          targetMode = 'collapsed';
        }
      } else if (viewMode === 'collapsed') {
        // From collapsed, dragging up - always go to default first, not fullscreen
        if (my < -dragThreshold || vy < -0.5) {
          targetMode = 'default';
        }
      }
      
      // Animate to the target height
      if (targetMode !== viewMode) {
        isAnimatingRef.current = true;
        
        // Start animating to the target height
        api.start({
          height: getCurrentHeight(targetMode),
          immediate: false,
          config: { 
            mass: 1, 
            tension: 280, 
            friction: 25 
          },
          onRest: () => {
            isAnimatingRef.current = false;
            // Set the view mode after animation completes
            setViewMode(targetMode);
            
            // Notify parent if needed
            if (onCollapseChange && (targetMode === 'collapsed') !== isCollapsed) {
              onCollapseChange(targetMode === 'collapsed');
            }
          }
        });
      } else {
        // If no change in mode, still animate back to current height
        isAnimatingRef.current = true;
        api.start({
          height: getCurrentHeight(),
          immediate: false
        });
      }
      
      // Clear dragging flag after a short delay
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 50);
    }
  });

  return (
    <animated.div
      ref={containerRef}
      className={`
        fixed left-0 right-0 z-10 
        md:left-1/2 md:transform md:-translate-x-1/2 md:max-w-md
        ${viewMode === 'fullscreen' ? 'bg-app-black rounded-none' : 'bg-[#212121] rounded-t-3xl'}`
      }
      style={{ 
        height,
        bottom: navbarHeight, // Position above bottom navigation
        top: viewMode === 'fullscreen' ? 0 : 'auto', // When fullscreen, attach to top
      }}
    >
      {/* Drag handle */}
      <div 
        className="drag-handle-container"
        {...bind()}
      >
        <div className="drag-handle" />
      </div>
      
      {/* Header with title and controls */}
      <div className="flex justify-between items-center px-6 py-2">
        <h2 className="text-white text-xl font-medium">
          Transactions
        </h2>
        
        {viewMode !== 'collapsed' && (
          <button 
            className="text-gray-400 text-sm hover:text-white transition-colors"
            onClick={handleFullscreenToggle}
          >
            {viewMode === 'fullscreen' ? 'Collapse' : 'Full records'}
          </button>
        )}
        
        {viewMode === 'collapsed' && (
          <button 
            className="text-gray-400 text-sm hover:text-white transition-colors"
            onClick={handleExpandClick}
          >
            Expand
          </button>
        )}
      </div>
      
      {/* Transaction list with proper overflow handling */}
      <div 
        className="overflow-y-auto" 
        style={{ 
          height: viewMode === 'collapsed' ? 0 : 'calc(100% - 60px)',
          opacity: viewMode === 'collapsed' ? 0 : 1,
          transition: 'opacity 0.2s ease-in-out' 
        }}
      > 
        <TransactionList transactionGroups={transactionGroups} />
      </div>
    </animated.div>
  );
};

export default TransactionContainer;