'use client';

import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  onClick,
  disabled = false,
  children,
  variant = 'primary',
  className = '',
  isLoading = false
}) => {
  const baseClasses = 'w-full py-4 px-6 rounded-lg font-medium transition-all duration-300';
  
  const variantClasses = {
    primary: 'bg-white text-black hover:bg-neutral-200',
    secondary: 'bg-neutral-800 text-white hover:bg-neutral-700'
  };
  
  const loadingIndicator = (
    <div className="flex items-center justify-center">
      <div className="flex space-x-2">
        <span className="h-2 w-2 bg-current rounded-full animate-pulse"></span>
        <span className="h-2 w-2 bg-current rounded-full animate-pulse [animation-delay:0.2s]"></span>
        <span className="h-2 w-2 bg-current rounded-full animate-pulse [animation-delay:0.4s]"></span>
      </div>
    </div>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {isLoading ? loadingIndicator : children}
    </button>
  );
};

export default Button;
