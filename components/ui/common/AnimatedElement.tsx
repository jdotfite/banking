'use client';

import React, { ReactNode } from 'react';
import { animated, useSpring, SpringConfig } from 'react-spring';

// Define animation presets
export type AnimationPreset = 
  | 'fadeIn' 
  | 'fadeOut' 
  | 'slideUp' 
  | 'slideDown' 
  | 'slideLeft' 
  | 'slideRight' 
  | 'scale' 
  | 'bounce';

// Define animation configuration
export type AnimationConfig = {
  delay?: number;
  duration?: number;
  config?: SpringConfig;
  immediate?: boolean;
  onRest?: () => void;
};

// Define component props
export interface AnimatedElementProps {
  children: ReactNode;
  animation?: AnimationPreset;
  customAnimation?: Record<string, any>; // For custom animations
  config?: AnimationConfig;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
}

/**
 * AnimatedElement - A reusable component for animations
 * 
 * This component provides consistent animations throughout the app
 * by encapsulating React Spring configurations into reusable presets.
 */
export const AnimatedElement: React.FC<AnimatedElementProps> = ({ 
  children, 
  animation = 'fadeIn',
  customAnimation,
  config = {},
  className = '',
  style = {},
  as: Component = 'div'
}) => {
  // Default spring configuration
  const defaultConfig: SpringConfig = { 
    mass: 1, 
    tension: 280, 
    friction: 25 
  };

  // Animation presets
  const animations = {
    fadeIn: { 
      from: { opacity: 0 }, 
      to: { opacity: 1 } 
    },
    fadeOut: { 
      from: { opacity: 1 }, 
      to: { opacity: 0 } 
    },
    slideUp: { 
      from: { opacity: 0, transform: 'translateY(20px)' }, 
      to: { opacity: 1, transform: 'translateY(0px)' } 
    },
    slideDown: { 
      from: { opacity: 0, transform: 'translateY(-20px)' }, 
      to: { opacity: 1, transform: 'translateY(0px)' } 
    },
    slideLeft: { 
      from: { opacity: 0, transform: 'translateX(20px)' }, 
      to: { opacity: 1, transform: 'translateX(0px)' } 
    },
    slideRight: { 
      from: { opacity: 0, transform: 'translateX(-20px)' }, 
      to: { opacity: 1, transform: 'translateX(0px)' } 
    },
    scale: { 
      from: { opacity: 0, transform: 'scale(0.9)' }, 
      to: { opacity: 1, transform: 'scale(1)' } 
    },
    bounce: { 
      from: { transform: 'scale(0.8)', opacity: 0 },
      to: { transform: 'scale(1)', opacity: 1 },
      config: { 
        tension: 300,
        friction: 10,
        mass: 1
      }
    }
  };

  // Get the animation preset or use custom animation
  const animationProps = customAnimation || animations[animation];
  
  // Create spring animation
  const spring = useSpring({
    ...animationProps,
    delay: config.delay || 0,
    config: config.config || defaultConfig,
    immediate: config.immediate || false,
    onRest: config.onRest
  });

  // Render the animated component
  return (
    <animated.div 
      style={{ 
        ...spring,
        ...style
      }}
      className={className}
    >
      {children}
    </animated.div>
  );
};

/**
 * Example usage:
 * 
 * <AnimatedElement animation="slideUp" config={{ delay: 200 }}>
 *   <p>This content will slide up with a 200ms delay</p>
 * </AnimatedElement>
 * 
 * <AnimatedElement 
 *   customAnimation={{ 
 *     from: { opacity: 0, transform: 'rotate(45deg)' }, 
 *     to: { opacity: 1, transform: 'rotate(0deg)' } 
 *   }}
 * >
 *   <p>This content will have a custom animation</p>
 * </AnimatedElement>
 */

export default AnimatedElement;
