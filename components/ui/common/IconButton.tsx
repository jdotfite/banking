'use client';

import React from 'react';
import { getIconByName } from '@/lib/config/iconMappings';

export interface IconButtonProps {
  icon: string;
  label?: string;
  onClick?: () => void;
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

/**
 * IconButton - A reusable button with an icon
 * 
 * This component provides a consistent button UI with icons throughout the app
 * with various styling options and interactive states.
 */
export const IconButton: React.FC<IconButtonProps> = ({ 
  icon,
  label,
  onClick,
  className = '',
  iconClassName = '',
  labelClassName = '',
  variant = 'primary',
  size = 'medium',
  disabled = false
}) => {
  // Get the icon component
  const IconComponent = getIconByName(icon);
  
  // Define size classes
  const sizeClasses = {
    small: {
      button: 'p-2',
      icon: 'w-4 h-4',
      iconContainer: 'w-8 h-8',
      text: 'text-xs'
    },
    medium: {
      button: 'p-4',
      icon: 'w-5 h-5',
      iconContainer: 'w-10 h-10',
      text: 'text-sm'
    },
    large: {
      button: 'p-5',
      icon: 'w-6 h-6',
      iconContainer: 'w-12 h-12',
      text: 'text-base'
    }
  };
  
  // Define variant classes
  const variantClasses = {
    primary: {
      button: 'bg-[#212121] hover:bg-neutral-700',
      iconContainer: 'bg-neutral-700',
      icon: 'text-gray-200',
      label: 'text-gray-300'
    },
    secondary: {
      button: 'bg-neutral-800 hover:bg-neutral-700',
      iconContainer: 'bg-neutral-700',
      icon: 'text-gray-300',
      label: 'text-gray-400'
    },
    ghost: {
      button: 'bg-transparent hover:bg-neutral-800',
      iconContainer: 'bg-neutral-800',
      icon: 'text-gray-300',
      label: 'text-gray-400'
    }
  };
  
  // Disabled state classes
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'transition-colors cursor-pointer';

  return (
    <button 
      className={`
        ${sizeClasses[size].button}
        ${variantClasses[variant].button}
        ${disabledClasses}
        rounded-xl flex items-center justify-center
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      <div className={`
        ${sizeClasses[size].iconContainer}
        ${variantClasses[variant].iconContainer}
        rounded-full flex items-center justify-center
        ${label ? 'mr-2' : ''}
      `}>
        <IconComponent className={`
          ${sizeClasses[size].icon}
          ${variantClasses[variant].icon}
          ${iconClassName}
        `} />
      </div>
      
      {label && (
        <span className={`
          ${sizeClasses[size].text}
          ${variantClasses[variant].label}
          ${labelClassName}
        `}>
          {label}
        </span>
      )}
    </button>
  );
};

export default IconButton;
