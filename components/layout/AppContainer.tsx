// components/layout/AppContainer.tsx
'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import BottomNav from '@/components/ui/navigation/BottomNav';

interface AppContainerProps {
  children: ReactNode;
}

const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
  const pathname = usePathname();
  const showBottomNav = !['/onboarding', '/login', '/signup'].includes(pathname || '');

  return (
    <div className="mx-auto max-w-md">
      {children}

      {showBottomNav && (
        <>
          <div className="h-20" /> {/* spacer only when nav is visible */}
          <div className="fixed bottom-0 left-0 right-0 z-[40]">
            <BottomNav />
          </div>
        </>
      )}
    </div>
  );
};

export default AppContainer;
