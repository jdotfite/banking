// components/ui/navigation/Header.tsx
import React from 'react';
import Icon from '../icons/Icon';

interface HeaderProps {
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  return (
    <div className="px-5 pt-8 pb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full mr-3 overflow-hidden">
            <img 
              src="/images/avatar/jess-coleman.png" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-xl font-medium tracking-tight">Welcome, {userName}!</div>
        </div>
        <button className="relative p-1">
          <Icon name="notificationBell" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full transform -translate-y-1/4 translate-x-1/4"></span>
        </button>
      </div>
    </div>
  );
};

export default Header;
