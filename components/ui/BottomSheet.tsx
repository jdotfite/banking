import React, { useEffect, useState } from 'react';
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
}

export const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({ 
  open, 
  onDismiss, 
  children, 
  header,
  className = '',
  maxHeight = 600,
  theme = 'light'
}) => {
  const [mounted, setMounted] = useState(false);
  
  // Ensure we're mounted before using window or document
  useEffect(() => {
    setMounted(true);
  }, []);
  const [{ y }, api] = useSpring(() => ({ 
    y: 100 // Start at 100% (fully hidden below screen)
  }));

  // Handle opening/closing animation
  useEffect(() => {
    if (mounted) {
      api.start({
        y: open ? 0 : 100, // 0% = visible, 100% = hidden below screen
        config: { tension: 300, friction: 30 }
      });
    }
  }, [open, api, mounted]);  // Handle drag gestures with content scroll detection
  const bind = useDrag(
    ({ last, velocity: [, vy], direction: [, dy], movement: [, my], cancel, event }) => {
      if (!mounted) return;
      
      // Check if we're dragging within the content area
      const target = event?.target as HTMLElement;
      const contentArea = target?.closest('.sheet-content');
      const dragHandle = target?.closest('.drag-handle');
      
      // If dragging in content area and content is scrollable, check scroll position
      if (contentArea && !dragHandle) {
        const canScrollUp = contentArea.scrollTop > 0;
        const canScrollDown = contentArea.scrollTop < (contentArea.scrollHeight - contentArea.clientHeight);
        
        // If trying to drag up but content can scroll up, don't interfere
        if (my < 0 && canScrollUp) {
          cancel();
          return;
        }
        
        // If trying to drag down but content can scroll down, don't interfere  
        if (my > 0 && canScrollDown) {
          cancel();
          return;
        }
      }
      
      // If dragging down fast or dragged down more than 100px, close
      if (last && (vy > 0.5 || my > 100)) {
        onDismiss();
      } else if (last) {
        // Snap back to open position
        api.start({ 
          y: 0, // Back to visible position
          config: { tension: 300, friction: 30 }
        });
      } else {
        // Follow drag movement (convert pixels to percentage)
        const dragPercentage = Math.max(0, (my / maxHeight) * 100);
        api.start({ 
          y: dragPercentage,
          immediate: true
        });
      }
    },
    { 
      axis: 'y',
      bounds: { top: 0 },
      rubberband: true,
      pointer: { touch: true }
    }
  );

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onDismiss();
    }
  };
  if (!open || !mounted) return null;

  // Theme-based styling
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-[#212121]' : 'bg-white';
  const handleClass = isDark ? 'bg-neutral-600' : 'bg-gray-300';
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
        zIndex: 2147483647, // Maximum z-index value
        pointerEvents: open ? 'auto' : 'none',
        // Force a new stacking context that bypasses any parent transforms
        transform: 'translateZ(0)',
        willChange: 'transform',
        isolation: 'isolate'
      }}
    >
      {/* Backdrop */}
      <div 
        className="backdrop"
        onClick={handleBackdropClick}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: open ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />
        {/* Bottom Sheet */}
      <animated.div
        {...bind()}
        style={{
          touchAction: 'none',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          transform: y.to((py) => `translateY(${py}%)`),
          willChange: 'transform'
        }}        className={`${bgClass} rounded-t-xl shadow-xl ${className}`}
      >        {/* Drag Handle */}
        <div className="drag-handle flex justify-center py-2">
          <div className={`w-8 h-1 ${handleClass} rounded-full`} />
        </div>
        
        {/* Header */}
        {header && (
          <div className={`px-4 py-3 border-b ${headerClass}`}>
            <h3 className="text-lg font-medium text-center">{header}</h3>
          </div>
        )}
          {/* Content */}
        <div className="sheet-content max-h-96 overflow-y-auto" style={{ touchAction: 'pan-y' }}>
          {children}
        </div>
      </animated.div>
    </div>
  );
  // Render the bottom sheet using a portal to ensure it's at the root level
  return createPortal(bottomSheetContent, document.body);
};
