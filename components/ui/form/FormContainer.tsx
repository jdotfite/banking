'use client';

import React from 'react';

interface FormContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showFooter?: boolean;
  footerContent?: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({
  children,
  title,
  subtitle,
  showFooter = true,
  footerContent = 'See legal disclosures'
}) => {
  // Split the title to apply different styling to parts
  const titleParts = title.split(' ');
  const firstWord = titleParts[0];
  const restOfTitle = titleParts.slice(1).join(' ');

  return (
    <div className="flex flex-col min-h-[calc(100vh-48px)] w-full bg-[#121212] pb-14">
      {/* Form content */}
      <div className="flex-grow overflow-auto px-6 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extralight text-white mb-2">
              {firstWord}{' '}
              {restOfTitle && <span className="font-normal">{restOfTitle}</span>}
            </h1>
            {subtitle && (
              <p className="text-neutral-400 text-sm">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form content */}
          {children}
        </div>
      </div>
      
      {/* Footer - Fixed at bottom */}
      {showFooter && (
        <div className="w-full border-t border-neutral-800/50 fixed bottom-0 left-0 bg-[#121212]">
          <div className="max-w-md mx-auto w-full py-4 px-6">
            <p className="text-center text-neutral-500 text-sm">
              {footerContent}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormContainer;
