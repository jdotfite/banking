'use client';

import React, { ReactNode } from 'react';
import { animated, useSpring } from 'react-spring';

export interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'interactive' | 'elevated';
  padding?: 'none' | 'small' | 'medium' | 'large';
  animate?: boolean;
}

/**
 * Card - A reusable card component
 * 
 * This component provides a consistent card UI throughout the app
 * with various styling options and interactive states.
 */
export const Card: React.FC<CardProps> = ({ 
  children, 
  onClick,
  className = '',
  variant = 'default',
  padding = 'medium',
  animate = false
}) => {
  // Define padding classes based on the padding prop
  const paddingClasses = {
    none: '',
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6'
  };
  
  // Define variant classes
  const variantClasses = {
    default: 'bg-[#212121]',
    interactive: 'bg-[#212121] cursor-pointer hover:bg-neutral-700 transition-colors',
    elevated: 'bg-[#212121] shadow-lg'
  };
  
  // Determine if the card is interactive
  const isInteractive = variant === 'interactive' || !!onClick;
  
  // Animation for hover effect
  const [spring, api] = useSpring(() => ({
    transform: 'scale(1)',
    config: { mass: 1, tension: 350, friction: 25 }
  }));
  
  // Handle hover events for animation
  const handleMouseEnter = () => {
    if (animate && isInteractive) {
      api.start({ transform: 'scale(1.02)' });
    }
  };
  
  const handleMouseLeave = () => {
    if (animate && isInteractive) {
      api.start({ transform: 'scale(1)' });
    }
  };

  return (
    <animated.div 
      className={`
        rounded-xl 
        ${paddingClasses[padding]} 
        ${isInteractive ? variantClasses.interactive : variantClasses[variant]} 
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={animate ? spring : undefined}
    >
      {children}
    </animated.div>
  );
};

export default Card;
