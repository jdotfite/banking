// components/layout/PageTemplate.tsx
'use client';

import React from 'react';
import BottomNav from '@/components/ui/navigation/BottomNav';

interface PageTemplateProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  className?: string;
  containerClassName?: string;
}

/**
 * Standardized page template that provides:
 * - Consistent layout structure with content constraints
 * - Optional bottom navigation
 * - Matches login and home page container behavior
 * 
 * Note: All context providers are handled in the root layout's ClientProviders
 */
const PageTemplate: React.FC<PageTemplateProps> = ({ 
  children, 
  showBottomNav = true, 
  className = "",
  containerClassName = ""
}) => {
  return (
    <div className={`relative min-h-screen bg-[#121212] text-white ${showBottomNav ? 'pb-20' : ''} ${className}`}>
      <div className={`px-5 mx-auto max-w-md ${containerClassName}`}>
        {children}
      </div>
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default PageTemplate;
