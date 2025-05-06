'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { bankingData } from '@/lib/data/fakeBankingData';
import { animated, useSpring } from 'react-spring';

interface AdminProps {
  onSelectUser: (userId: string | null) => void;
}

const Admin: React.FC<AdminProps> = ({ onSelectUser }) => {
  const router = useRouter();
  const [users, setUsers] = useState(bankingData.users);
  const [isLoading, setIsLoading] = useState(true);

  // Setup viewport height for mobile browsers
  useEffect(() => {
    const setViewportHeight = () => {
      document.documentElement.style.setProperty(
        '--vh', 
        `${window.innerHeight * 0.01}px`
      );
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    return () => window.removeEventListener('resize', setViewportHeight);
  }, []);

  // Generate card animations dynamically based on user count
  const newUserSpring = useSpring({
    opacity: isLoading ? 0 : 1,
    transform: isLoading ? 'translateY(20px)' : 'translateY(0px)',
    config: { tension: 280, friction: 25 },
    delay: 300,
  });
  
  // Generate springs for each user
  const userSprings = users.map((_, index) => 
    useSpring({
      opacity: isLoading ? 0 : 1,
      transform: isLoading ? 'translateY(20px)' : 'translateY(0px)',
      config: { tension: 280, friction: 25 },
      delay: 350 + (index * 50), // Stagger the animations
    })
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectUser = (userId: string | null) => {
    if (userId === 'new') {
      localStorage.setItem('selectedUserId', 'new');
      onSelectUser('new');
    } else if (userId) {
      localStorage.setItem('selectedUserId', userId);
      onSelectUser(userId);
    } else {
      localStorage.removeItem('selectedUserId');
      onSelectUser(null);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0  bg-app-black flex items-center justify-center z-50">
        <div className="w-28 h-28">
          <img 
            src="/images/icons/logo.svg" 
            alt="Loading" 
            className="w-full h-full object-contain animate-spin"
            style={{
              animationDuration: '2s',
              animationTimingFunction: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)'
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-screen">
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="p-5 max-w-md mx-auto w-full">
          <div className="text-center mb-8 pt-6">
            {/* Title and subtitle removed as requested */}
          </div>

          {/* New User Option removed as requested */}

          <h3 className="text-lg font-medium mb-3 text-neutral-300">Existing Profiles</h3>
          
          {users.map((user, index) => {
            const userAccount = bankingData.accounts.find(account => account.userId === user.id);
            const userCard = bankingData.creditCards.find(card => card.userId === user.id);
            
            return (
              <animated.div 
                key={user.id}
                style={userSprings[index]} 
                className="bg-[#212121] rounded-xl p-5 mb-4 cursor-pointer hover:bg-neutral-700 transition-colors"
                onClick={() => handleSelectUser(user.id)}
              >
                <div className="flex items-center mb-3">
                  <img 
                    src={user.avatar || '/images/avatar/placeholder.svg'} 
                    alt={user.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover border border-gray-700"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-white">{user.name}</h2>
                        <p className="text-neutral-400">{user.occupation}</p>
                      </div>
                      <button 
                        className="text-neutral-400 hover:text-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Edit account:', user.id);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-neutral-700 p-3 rounded-lg">
                    <p className="text-neutral-400 mb-1">Checking Balance</p>
                    <p className="text-white font-medium">${userAccount?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
                  </div>
                  <div className="bg-neutral-900 p-3 rounded-lg">
                    <p className="text-neutral-400 mb-1">Credit Card</p>
                    <p className="text-white font-medium">{userCard?.name || 'None'}</p>
                  </div>
                </div>
              </animated.div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default Admin;