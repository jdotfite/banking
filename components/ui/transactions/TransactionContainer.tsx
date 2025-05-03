// components/ui/transactions/TransactionContainer.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import TransactionList from './TransactionList';
import { TransactionDateGroup } from '@/lib/types';
import SpendingChart from '../charts/SpendingChart';

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
    isCollapsed ? 'collapsed' : 'fullscreen' // Default to fullscreen when opening
  );
  
  // Shared period state for both chart and transactions
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const isAnimatingRef = useRef(false);
  
  // Heights for each state
  const [collapsedHeight, setCollapsedHeight] = useState(80); // Just enough for header
  const [defaultHeight, setDefaultHeight] = useState(500);
  const [fullscreenHeight, setFullscreenHeight] = useState(window.innerHeight);
  const [navbarHeight] = useState(64); // Bottom navigation height
  
  // Synchronize with parent's collapsed state
  useEffect(() => {
    if (isCollapsed) {
      setViewMode('collapsed');
    } else {
      setViewMode('fullscreen'); // Open in fullscreen
    }
  }, [isCollapsed]);
  
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
  
  // Set up spring animation for the height
  const [{ height }, api] = useSpring(() => ({
    from: { height: isCollapsed ? collapsedHeight : fullscreenHeight },
    to: { height: isCollapsed ? collapsedHeight : fullscreenHeight },
    config: { mass: 1, tension: 280, friction: 25 },
    immediate: false,
    onRest: () => {
      isAnimatingRef.current = false;
      
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
    
    // When expanding from collapsed, go to fullscreen view
    setViewMode('fullscreen');
    
    // Notify parent
    if (onCollapseChange) {
      onCollapseChange(false);
    }
  };
  
  // Filter options
  const periodOptions = [
    { id: 'day', name: 'Day', label: 'today' },
    { id: 'week', name: 'Week', label: 'this week' },
    { id: 'month', name: 'Month', label: 'this month' },
    { id: 'year', name: 'Year', label: 'this year' },
  ];
  
  // Handle period change - unified for both chart and transactions
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };
  
  // Set up drag gesture
  const bind = useDrag(({ movement: [_, my], last, velocity, first, active }) => {
    // Handle drag start
    if (first) {
      isDraggingRef.current = true;
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
        // From collapsed, dragging up - always go to fullscreen
        if (my < -dragThreshold || vy < -0.5) {
          targetMode = 'fullscreen';
        }
      }
      
      // Animate to the target height
      if (targetMode !== viewMode) {
        isAnimatingRef.current = true;
        setViewMode(targetMode);
        
        // Start animating to the target height
        api.start({
          height: getCurrentHeight(targetMode),
          immediate: false,
          config: { 
            mass: 1, 
            tension: 280, 
            friction: 25 
          }
        });
        
        // Notify parent if needed
        if (onCollapseChange && (targetMode === 'collapsed') !== isCollapsed) {
          onCollapseChange(targetMode === 'collapsed');
        }
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
        fixed left-0 right-0 overflow-hidden
        md:left-1/2 md:transform md:-translate-x-1/2 md:max-w-md
        ${viewMode === 'fullscreen' ? 'bg-app-black rounded-none' : 'bg-[#212121] rounded-t-3xl shadow-lg'}`
      }
      style={{ 
        height,
        bottom: navbarHeight, // Position above bottom navigation
        top: 'auto', // Never attach to top
        maxHeight: viewMode === 'fullscreen' ? `calc(100vh - ${navbarHeight}px)` : 'none',
        zIndex: 50, // Ensure proper z-index
      }}
    >
      {/* Drag handle */}
      <div 
        className="drag-handle-container mt-1" 
        {...bind()}
      >
        <div className="drag-handle" />
      </div>
      
      {/* Header with title and controls */}
      <div className="flex justify-between items-center px-6 pt-2 py-2">
        <h2 className="text-white text-xl font-medium">
          Transactions
        </h2>
        
        {viewMode === 'fullscreen' && (
          <button 
            className="text-gray-400 text-sm hover:text-white transition-colors"
            onClick={() => {
              // Direct collapse
              setViewMode('collapsed');
              if (onCollapseChange) {
                onCollapseChange(true);
              }
            }}
          >
            Collapse
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
      
      {/* Chart section - Spending Chart First */}
      {viewMode === 'fullscreen' && (
        <div className="px-6 mt-2 mb-4">
          <SpendingChart 
            selectedPeriod={selectedPeriod} 
            periodOptions={periodOptions}
          />
        </div>
      )}
      
      {/* Period selector tabs - MOVED BELOW the chart to match inspiration */}
      {viewMode === 'fullscreen' && (
        <div className="px-6 mb-6">
          <div className="flex justify-between rounded-lg overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
            {periodOptions.map((option) => (
              <button
                key={option.id}
                className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                  selectedPeriod === option.id
                    ? 'bg-[#333333] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => handlePeriodChange(option.id)}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Transaction list with proper overflow handling */}
      <div 
        className="overflow-y-auto" 
        style={{ 
          height: viewMode === 'collapsed' ? 0 : viewMode === 'fullscreen' ? 'calc(100% - 340px)' : 'calc(100% - 60px)',
          opacity: viewMode === 'collapsed' ? 0 : 1,
          transition: 'opacity 0.2s ease-in-out' 
        }}
      > 
        <TransactionList 
          transactionGroups={transactionGroups} 
          selectedPeriod={selectedPeriod}
        />
      </div>
    </animated.div>
  );
};

export default TransactionContainer;
