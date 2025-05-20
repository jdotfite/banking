'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import generateFakeUsers from '@/lib/data/fakeBankingData';
import { animated, useSpring, useSprings } from 'react-spring';
import UserEditModal from './UserEditModal';
import { ChevronLeft, ChevronRight, Settings, CreditCard, Wallet, Home, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/form';

interface UsersProps {
  onSelectUser: (userId: string | null) => void;
}

const Users: React.FC<UsersProps> = ({ onSelectUser }) => {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [activeProductIndex, setActiveProductIndex] = useState<Record<string, number>>({});
  
  // Load banking data from localStorage or fall back to fake data
  const [bankingData, setBankingData] = useState(() => {
    try {
      const storedData = localStorage.getItem('bankingData');
      return storedData ? JSON.parse(storedData) : generateFakeUsers();
    } catch {
      return generateFakeUsers();
    }
  });

  const [users, setUsers] = useState(bankingData.users);
  
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

  // Generate springs for each user (for entry animation)
  const [userSprings] = useSprings(users.length, index => ({
    opacity: 1,
    transform: 'translateY(0px)',
    config: { tension: 280, friction: 25 },
    delay: 350 + index * 50,
  }));

  // Create individual useSpring hooks for each user
  // First, create refs to store the API for each user's spring
  const springApis = React.useRef<any[]>([]);
  
  // Create the spring props for each user
  const productSpringProps = users.map((user, i) => {
    // Use useSpring with the ref API pattern
    const [props, api] = useSpring(() => ({
      opacity: 1,
      transform: 'translateX(0px)',
      config: { tension: 300, friction: 20 },
    }));
    
    // Store the API in our ref array
    springApis.current[i] = api;
    
    return props;
  });

  const handleSelectUser = (userId: string | null) => {
    if (userId === 'new') {
      localStorage.setItem('selectedUserId', 'new');
      onSelectUser('new');
      router.push('/onboarding');
    } else if (userId) {
      localStorage.setItem('selectedUserId', userId);
      onSelectUser(userId);
      router.push('/home');
    } else {
      localStorage.removeItem('selectedUserId');
      onSelectUser(null);
      router.push('/');
    }
  };
  
  const handleEditUser = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditModal(userId);
  };
  
  // Helper to get the user index from userId
  const getUserIndex = useCallback((userId: string) => {
    return users.findIndex(user => user.id === userId);
  }, [users]);
  
  const nextProduct = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const userIndex = getUserIndex(userId);
    if (userIndex === -1) return;
    
    const userAccounts = bankingData.accounts.filter((account: any) => account.userId === userId);
    const userCards = bankingData.creditCards.filter((card: any) => card.userId === userId);
    const userLoans = bankingData.loans.filter((loan: any) => loan.userId === userId);

    const totalProducts = userAccounts.length + userCards.length + userLoans.length;
    const currentIndex = activeProductIndex[userId] || 0;
    const newIndex = (currentIndex + 1) % totalProducts; 

    // Animate right - using the specific spring API for this user
    if (springApis.current[userIndex]) {
      springApis.current[userIndex].start({
        from: { opacity: 0, transform: 'translateX(50px)' },
        to: { opacity: 1, transform: 'translateX(0px)' },
        reset: true,
      });
    }

    setActiveProductIndex({
      ...activeProductIndex,
      [userId]: newIndex,
    });
  };

  const prevProduct = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const userIndex = getUserIndex(userId);
    if (userIndex === -1) return;
    
    const userAccounts = bankingData.accounts.filter((account: any) => account.userId === userId);
    const userCards = bankingData.creditCards.filter((card: any) => card.userId === userId);
    const userLoans = bankingData.loans.filter((loan: any) => loan.userId === userId);

    const totalProducts = userAccounts.length + userCards.length + userLoans.length;
    const currentIndex = activeProductIndex[userId] || 0;
    const newIndex = (currentIndex - 1 + totalProducts) % totalProducts; 

    // Animate left - using the specific spring API for this user
    if (springApis.current[userIndex]) {
      springApis.current[userIndex].start({
        from: { opacity: 0, transform: 'translateX(-50px)' },
        to: { opacity: 1, transform: 'translateX(0px)' },
        reset: true,
      });
    }

    setActiveProductIndex({
      ...activeProductIndex,
      [userId]: newIndex,
    });
  };
  
  const getProductCard = (userId: string, index: number) => {
    const userAccounts = bankingData.accounts.filter((account: any) => account.userId === userId);
    const userCards = bankingData.creditCards.filter((card: any) => card.userId === userId);
    const userLoans = bankingData.loans.filter((loan: any) => loan.userId === userId);
    
    // Combine all products
    const allProducts = [...userAccounts, ...userCards, ...userLoans];
    const product = allProducts[index];
    
    if (!product) return null;
    
    if (product.type === 'checking' || product.type === 'savings' || product.type === 'moneyMarket' || product.type === 'cd') {
      // It's an account
      return (
        <div className="bg-neutral-700 p-3 flex items-center">
          {product.type === 'checking' ? (
            <Wallet className="w-5 h-5 text-neutral-300 mr-3" />
          ) : (
            <PiggyBank className="w-5 h-5 text-neutral-300 mr-3" />
          )}
          <div>
            <p className="text-neutral-400 text-xs mb-1">{product.name}</p>
            <p className="text-white font-medium">${product.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
          </div>
        </div>
      );
    } else if (product.type === 'visa' || product.type === 'mastercard') {
      // It's a credit card
      return (
        <div className="bg-neutral-700 p-3 flex items-center">
          <CreditCard className="w-5 h-5 text-neutral-300 mr-3" />
          <div>
            <p className="text-neutral-400 text-xs mb-1">{product.name}</p>
            <p className="text-white font-medium">Balance: ${product.currentBalance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
          </div>
        </div>
      );
    } else {
      // It's a loan
      return (
        <div className="bg-neutral-700 p-3 flex items-center">
          <Home className="w-5 h-5 text-neutral-300 mr-3" />
          <div>
            <p className="text-neutral-400 text-xs mb-1">{product.name}</p>
            <p className="text-white font-medium">Bal: ${product.currentBalance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
          </div>
        </div>
      );
    }
  };
  
  const getProductCount = (userId: string) => {
    const userAccounts = bankingData.accounts.filter((account: any) => account.userId === userId);
    const userCards = bankingData.creditCards.filter((card: any) => card.userId === userId);
    const userLoans = bankingData.loans.filter((loan: any) => loan.userId === userId);
    return userAccounts.length + userCards.length + userLoans.length;
  };

  return (
    <div className="bg-[#121212] min-h-screen">
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="p-5 max-w-md mx-auto w-full">
          <div className="text-center mb-8 pt-6">
            <h1 className="text-2xl font-bold text-white">Demo User Profiles</h1>
          </div>

          <h3 className="text-lg font-medium mb-3 text-neutral-300">User Profiles</h3>
          
          {users.map((user: any, index: number) => {
            const productCount = getProductCount(user.id);
            const currentProductIndex = activeProductIndex[user.id] || 0;
            
            return (
              <animated.div 
                key={user.id}
                style={userSprings[index]} 
                className="bg-[#212121] rounded-lg p-5 mb-4"
              >
                <div 
                  className="flex items-center mb-3 cursor-pointer"
                  onClick={() => handleSelectUser(user.id)}
                >
                  <img 
                    src={user.avatar || '/images/avatar/placeholder.svg'} 
                    alt={user.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover border border-neutral-700"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-white">{user.name}</h2>
                        <p className="text-neutral-400">{user.occupation}</p>
                      </div>
                      <button 
                        className="text-neutral-400 hover:text-white transition-colors"
                        onClick={(e) => handleEditUser(user.id, e)}
                      >
                        <Settings className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mb-1">
                  <p className="text-xs text-neutral-400">Products ({productCount})</p>
                </div>
                
                <div className="relative">
                  {productCount > 0 && (
                    <div className="flex items-center">
                      {productCount > 1 && (
                        <button 
                          onClick={(e) => prevProduct(user.id, e)}
                          className="absolute left-0 z-10 h-full flex items-center justify-center px-2 bg-neutral-700 hover:bg-neutral-800 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                      )}
                      
                      <div className="w-full px-8" style={{ touchAction: 'pan-y' }}>
                        <div
                          className="select-none touch-pan-x"
                          style={{ cursor: 'grab' }}
                          onMouseDown={e => {
                            const startX = e.clientX;
                            const handleMouseMove = (moveEvent: MouseEvent) => {
                              // Optionally, you could add visual feedback here
                            };
                            const handleMouseUp = (upEvent: MouseEvent) => {
                              const deltaX = upEvent.clientX - startX;
                              if (deltaX < -50) {
                                nextProduct(user.id, e as any);
                              } else if (deltaX > 50) {
                                prevProduct(user.id, e as any);
                              }
                              window.removeEventListener('mousemove', handleMouseMove);
                              window.removeEventListener('mouseup', handleMouseUp);
                            };
                            window.addEventListener('mousemove', handleMouseMove);
                            window.addEventListener('mouseup', handleMouseUp);
                          }}
                          onTouchStart={e => {
                            const touch = e.touches[0];
                            const startX = touch.clientX;
                            const handleTouchMove = (moveEvent: TouchEvent) => {
                              // Optionally, you could add visual feedback here
                            };
                            const handleTouchEnd = (endEvent: TouchEvent) => {
                              const endTouch = endEvent.changedTouches[0];
                              const deltaX = endTouch.clientX - startX;
                              if (deltaX < -50) {
                                nextProduct(user.id, e as any);
                              } else if (deltaX > 50) {
                                prevProduct(user.id, e as any);
                              }
                              window.removeEventListener('touchmove', handleTouchMove);
                              window.removeEventListener('touchend', handleTouchEnd);
                            };
                            window.addEventListener('touchmove', handleTouchMove);
                            window.addEventListener('touchend', handleTouchEnd);
                          }}
                        >
                          {/* Use the pre-created spring from the top level */}
                          <animated.div style={productSpringProps[index]}>
                            {getProductCard(user.id, currentProductIndex)}
                          </animated.div>
                        </div>
                      </div>
                      
                      {productCount > 1 && (
                        <button 
                          onClick={(e) => nextProduct(user.id, e)}
                          className="absolute right-0 z-10 h-full flex items-center justify-center px-2 bg-neutral-700 hover:bg-neutral-800 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {productCount > 1 && (
                  <div className="flex justify-center space-x-1 mt-2">
                    {Array.from({ length: productCount }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1 h-1 rounded-full ${i === currentProductIndex ? 'bg-white' : 'bg-neutral-600'}`}
                      />
                    ))}
                  </div>
                )}
              </animated.div>
            );
          })}
          
          {/* Button to add new test user */}
          <div className="mt-4">
            <Button 
              variant="secondary"
              onClick={() => handleSelectUser('new')}
            >
              + Add New Test User
            </Button>
          </div>
        </div>
      </div>
      
      {/* User Edit Modal */}
      {showEditModal && (
        <UserEditModal 
          userId={showEditModal} 
          bankingData={bankingData}
          onClose={() => setShowEditModal(null)}
          onSave={(updatedData) => {
            setBankingData(updatedData);
            localStorage.setItem('bankingData', JSON.stringify(updatedData));
            setUsers(updatedData.users);
            setShowEditModal(null);
          }}
        />
      )}
    </div>
  );
};

export default Users;