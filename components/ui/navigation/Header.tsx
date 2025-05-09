// components/ui/navigation/Header.tsx
'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { animated, useSpring } from 'react-spring';
import { useBankingData } from '@/components/preloaders/SimplifiedBankingDataProvider';

interface HeaderProps {
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  // Get user data for avatar
  const { userData } = useBankingData();
  const userAvatar = userData?.user?.avatar || '/images/avatar/placeholder.svg';
  // Create a spring animation for the header
  const headerSpring = useSpring({
    from: { opacity: 0, y: -10 },
    to: { opacity: 1, y: 0 },
    config: { tension: 280, friction: 25 },
  });

  // Animation for the notification dot
  const notificationSpring = useSpring({
    from: { transform: 'scale(0)' },
    to: { transform: 'scale(1)' },
    delay: 500,
    config: { tension: 400, friction: 20 },
  });

  return (
    <animated.div style={headerSpring} className="px-5 pt-8 pb-6 mx-auto max-w-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full mr-3 overflow-hidden border border-neutral-700">
            <img 
              src={userAvatar} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-xl font-medium tracking-tight">Welcome, {userName}!</div>
        </div>
        <button className="relative p-1">
          <Bell className="w-6 h-6" />
          <animated.span 
            style={notificationSpring}
            className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full transform -translate-y-1/4 translate-x-1/4"
          ></animated.span>
        </button>
      </div>
    </animated.div>
  );
};

export default Header;
