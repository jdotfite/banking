// components/screens/AdminProfileSelector.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { bankingData } from '@/lib/data/fakeBankingData';
import { animated, useSpring } from 'react-spring';
import PWAInstallPrompt from '@/components/ui/common/PWAInstallPrompt';

interface AdminProfileSelectorProps {
  onSelectUser: (userId: string | null) => void;
}

const AdminProfileSelector: React.FC<AdminProfileSelectorProps> = ({ onSelectUser }) => {
  const router = useRouter();
  const [users, setUsers] = useState(bankingData.users);
  const [isLoading, setIsLoading] = useState(true);

  // Setup viewport height for mobile browsers
  useEffect(() => {
    const setViewportHeight = () => {
      // Set a CSS variable for the actual viewport height
      document.documentElement.style.setProperty(
        '--vh', 
        `${window.innerHeight * 0.01}px`
      );
    };

    // Initial calculation
    setViewportHeight();
    
    // Recalculate on resize
    window.addEventListener('resize', setViewportHeight);
    
    return () => {
      window.removeEventListener('resize', setViewportHeight);
    };
  }, []);

  // Animation for the container - staggered animation like in Home.tsx
  const containerSpring = useSpring({
    opacity: isLoading ? 0 : 1,
    transform: isLoading ? 'translateY(20px)' : 'translateY(0px)',
    config: { tension: 280, friction: 25 },
    delay: 300,
  });

  // Animation for the title
  const titleSpring = useSpring({
    opacity: isLoading ? 0 : 1,
    transform: isLoading ? 'translateY(20px)' : 'translateY(0px)',
    config: { tension: 280, friction: 25 },
    delay: 400,
  });

  // Function to generate card springs with staggered delays
  const getCardSpring = (index: number) => useSpring({
    opacity: isLoading ? 0 : 1,
    transform: isLoading ? 'translateY(20px)' : 'translateY(0px)',
    config: { tension: 280, friction: 25 },
    delay: 500 + (index * 50), // Staggered delay like in Home.tsx
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle user selection
  const handleSelectUser = (userId: string | null) => {
    // Store the selected user ID in localStorage
    if (userId === 'new') {
      // For new user flow
      localStorage.setItem('selectedUserId', 'new');
      onSelectUser('new');
    } else if (userId) {
      // For existing users
      localStorage.setItem('selectedUserId', userId);
      onSelectUser(userId);
    } else {
      // Fallback (should not happen)
      localStorage.removeItem('selectedUserId');
      onSelectUser(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center overflow-hidden" 
           style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
        <div className="w-24 h-24">
          <img 
            src="/icons/icon-192x192.png" 
            alt="Members 1st" 
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
    <div 
      className="bg-app-black text-white overflow-x-hidden"
      style={{ height: 'calc(var(--vh, 1vh) * 100)', minHeight: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <div className="h-full overflow-y-auto">
        <div className="p-5">
          <animated.div style={titleSpring} className="text-center mb-8 pt-6">
            <h1 className="text-2xl font-bold mb-2">Banking App Admin</h1>
            <p className="text-neutral-400">Select a profile to continue</p>
          </animated.div>

          <animated.div style={containerSpring} className="max-w-md mx-auto">
            {/* New User Option */}
            <animated.div 
              style={getCardSpring(0)} 
              className="bg-[#212121] rounded-xl p-5 mb-5 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleSelectUser('new')}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">New User</h2>
                  <p className="text-neutral-400">Start with a fresh account</p>
                </div>
              </div>
            </animated.div>

            <h3 className="text-lg font-medium mb-3 text-neutral-300">Existing Profiles</h3>
            
            {/* Existing Users */}
            {users.map((user, index) => {
              // Find user's account
              const userAccount = bankingData.accounts.find(account => account.userId === user.id);
              // Find user's credit card
              const userCard = bankingData.creditCards.find(card => card.userId === user.id);
              
              return (
                <animated.div 
                  key={user.id}
                  style={getCardSpring(index + 1)} 
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
                          <h2 className="text-xl font-bold">{user.name}</h2>
                          <p className="text-neutral-400">{user.occupation}</p>
                        </div>
                        <button 
                          className="text-neutral-400 hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement account modification
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
                      <p className="text-white font-medium">${userAccount?.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-neutral-900 p-3 rounded-lg">
                      <p className="text-neutral-400 mb-1">Credit Card</p>
                      <p className="text-white font-medium">{userCard?.name || 'None'}</p>
                    </div>
                  </div>
                </animated.div>
              );
            })}

            <div className="mt-8 mb-8 text-center text-xs text-neutral-500">
              <p>This screen is only visible in development mode</p>
              <p className="mt-1">Banking App Admin v1.0</p>
            </div>
          </animated.div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileSelector;