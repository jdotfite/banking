// components/ui/navigation/Header.tsx
'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { animated, useSpring } from 'react-spring';
import { useBankingData } from '@/components/context/BankingDataProvider';

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
    <animated.div style={headerSpring} className="pt-8 pb-6 mx-auto max-w-md">      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg mr-3 overflow-hidden">
            <img 
              src={userAvatar} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>          <div>
            <div className="text-sm text-neutral-500 leading-none">Welcome Back,</div>
            <div className="text-xl font-medium tracking-tight leading-tight">{userName}</div>
          </div>
        </div>
        <button className="relative">
          <div className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>          <animated.span 
            style={{
              ...notificationSpring,
              position: 'absolute',
              right: '12px',
              top: '8px',
              width: '0.5rem',
              height: '0.5rem'
            }}
            className="bg-red-500 rounded-full"
          ></animated.span>
        </button>
      </div>
    </animated.div>
  );
};

export default Header;
