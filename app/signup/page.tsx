'use client';

import React, { useEffect } from 'react';
import SignupFlow from '@/app/signup/components/SignupFlow';

export default function SignupPage() {
  // Fix for iOS text disappearing in inputs
  useEffect(() => {
    // Force 16px font size for inputs on mobile to prevent zoom
    const style = document.createElement('style');
    style.textContent = `
      @media screen and (max-width: 768px) {
        input, select, textarea {
          font-size: 16px !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Add additional meta tag for iOS if needed
    const metaFormatDetection = document.createElement('meta');
    metaFormatDetection.name = 'format-detection';
    metaFormatDetection.content = 'telephone=no';
    document.head.appendChild(metaFormatDetection);
    
    return () => {
      document.head.removeChild(style);
      if (document.head.contains(metaFormatDetection)) {
        document.head.removeChild(metaFormatDetection);
      }
    };
  }, []);

  return <SignupFlow />;
}
