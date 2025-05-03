'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';

interface ThemeContextProviderProps {
  children: ReactNode;
  defaultTheme?: 'dark' | 'light' | 'system';
}

/**
 * Separate provider component to prevent unnecessary re-renders
 */
const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ 
  children, 
  defaultTheme = 'dark' 
}) => {
  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      {children}
    </ThemeProvider>
  );
};

export default ThemeContextProvider;
