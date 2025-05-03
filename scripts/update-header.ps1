// scripts/update-header.ps1
$content = @"
// components/ui/navigation/Header.tsx
'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { animated, useSpring } from 'react-spring';
import { useBankingData } from '@/components/preloaders/BankingDataPreloader';

interface HeaderProps {
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  // Get banking data to display user info
  const { data } = useBankingData();
  
  // Get real user data if available
  const displayName = data?.users?.[0]?.name?.split(' ')[0] || userName;
  
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

  // Get avatar image from banking data if available
  const avatarImage = data?.users?.[0]?.avatar || '/images/avatar/jess-coleman.png';

  return (
    <animated.div style={headerSpring} className="px-5 pt-8 pb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full mr-3 overflow-hidden">
            <img 
              src={avatarImage}
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-xl font-medium tracking-tight">Welcome, {displayName}!</div>
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
"@

Set-Content -Path "./components/ui/navigation/Header.tsx" -Value $content -Force
