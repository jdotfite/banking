// components/ui/navigation/BottomNav.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { animated, useSpring } from 'react-spring';
import Icon from '../icons/Icon';
import { NavItemType } from '@/lib/types';

const BottomNav: React.FC = () => {
  const pathname = usePathname();
  
  // Define the navigation items with new arrangement
  const items: NavItemType[] = [
    { name: 'Home', icon: 'home', href: '/home' },
    { name: 'Cards', icon: 'card', href: '/credit-card' },
    { name: 'Accounts', icon: 'wallet', href: '/' },
    { name: 'Transfer', icon: 'transfer', href: '/transfer' },
    { name: 'More', icon: 'more', href: '/more' },
  ];
  
  // Create a spring animation for the navbar
  const navbarSpring = useSpring({
    from: { y: 20 },
    to: { y: 0 },
    config: { tension: 280, friction: 25 },
    delay: 300,
  });

  return (
    <animated.div 
      style={{
        opacity: 1, // Always visible
        transform: `translateY(${navbarSpring.y}px)`,
        zIndex: 100
      }}
      className="fixed bottom-0 left-0 right-0 bg-[#212121] py-3 px-4 flex justify-between items-center
        md:left-1/2 md:transform md:-translate-x-1/2 md:max-w-sm
        lg:max-w-md xl:max-w-md"
    >
      {items.map((item) => {
        const isActive = pathname === item.href;
        const isSpecial = item.name === 'Accounts';

        return (
          <Link 
            key={item.name} 
            href={item.href}
            className="flex flex-col items-center"
          >
            <div
              className={`
                ${isActive ? 'text-white' : 'text-gray-400'} 
                ${isSpecial ? 'bg-red-600 p-3 rounded-full -mt-8 shadow-lg border border-red-700' : ''}
                transition-all duration-200
              `}
            >
              <Icon name={item.icon} className={`${isSpecial ? 'w-6 h-6' : 'w-5 h-5'}`} />
            </div>
            <span
              className={`text-xs mt-1 ${isActive ? 'text-white' : 'text-gray-400'}`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </animated.div>
  );
};

export default BottomNav;
