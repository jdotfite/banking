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
  const baseClasses = `
    w-full py-3 px-5 font-medium 
    border border-[#aaa] text-[#eee]
    btn-ripple
  `;
  
  const loadingIndicator = (
    <div className="flex items-center justify-center h-6">
      <div className="flex space-x-2">
        <span className="h-3 w-3 bg-current rounded-full animate-pulse"></span>
        <span className="h-3 w-3 bg-current rounded-full animate-pulse [animation-delay:0.2s]"></span>
        <span className="h-3 w-3 bg-current rounded-full animate-pulse [animation-delay:0.4s]"></span>
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
        ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {isLoading ? loadingIndicator : <span className="relative block">{children}</span>}
    </button>
  );
};

export default Button;
