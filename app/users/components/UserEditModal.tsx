'use client';

import * as React from 'react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Settings, CreditCard, Wallet, Home, PiggyBank } from 'lucide-react';

interface UserEditModalProps {
  userId: string;
  bankingData: any;
  onClose: () => void;
  onSave: (updatedData: any) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ userId, bankingData, onClose, onSave }) => {
  const user = bankingData.users.find((u: any) => u.id === userId);
  const [userAccounts, setUserAccounts] = useState(
    bankingData.accounts.filter((account: any) => account.userId === userId)
  );
  const [userCards, setUserCards] = useState(
    bankingData.creditCards.filter((card: any) => card.userId === userId)
  );
  const [userLoans, setUserLoans] = useState(
    bankingData.loans.filter((loan: any) => loan.userId === userId)
  );
  
  const [activeTab, setActiveTab] = useState('profile');
  const [editedUser, setEditedUser] = useState({ ...user });
  
  const handleAccountBalanceChange = (accountId: string, newBalance: number) => {
    const updatedAccounts = userAccounts.map((account: any) => {
      if (account.id === accountId) {
        return {
          ...account,
          balance: newBalance,
          availableBalance: newBalance
        };
      }
      return account;
    });
    setUserAccounts(updatedAccounts);
  };
  
  const handleCardBalanceChange = (cardId: string, newBalance: number) => {
    const updatedCards = userCards.map((card: any) => {
      if (card.id === cardId) {
        const availableCredit = card.creditLimit - newBalance;
        return {
          ...card,
          currentBalance: newBalance,
          availableCredit: availableCredit > 0 ? availableCredit : 0
        };
      }
      return card;
    });
    setUserCards(updatedCards);
  };
  
  const handleLoanBalanceChange = (loanId: string, newBalance: number) => {
    const updatedLoans = userLoans.map((loan: any) => {
      if (loan.id === loanId) {
        return {
          ...loan,
          currentBalance: newBalance
        };
      }
      return loan;
    });
    setUserLoans(updatedLoans);
  };
  
  const addNewAccount = (type: string) => {
    const newAccountId = `acct-${Date.now()}`;
    const newAccount = {
      id: newAccountId,
      userId: userId,
      type: type,
      name: `Members 1st ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      accountNumber: `****${Math.floor(1000 + Math.random() * 9000)}`,
      routingNumber: '231382241',
      balance: 0,
      availableBalance: 0,
      pendingTransactions: 0,
      interestRate: type === 'savings' ? 1.75 : 0.05,
      openDate: new Date().toISOString().split('T')[0]
    };
    setUserAccounts([...userAccounts, newAccount]);
  };
  
  const cardOptions = [
    {
      type: 'visa-signature-rewards',
      name: 'Visa Signature® Rewards',
      color: '#b71c1c',
      image: '/images/cards/credit/card-sig-rewards.png',
      creditLimit: 10000,
      rewardsType: 'cashback',
      rewardsRate: '1.5%',
    },
    {
      type: 'visa-platinum-rewards',
      name: 'Visa Platinum® Rewards',
      color: '#1a237e',
      image: '/images/cards/credit/card-plat-rewards.png',
      creditLimit: 5000,
      rewardsType: 'points',
      rewardsRate: '1%',
    },
    {
      type: 'visa-platinum-low',
      name: 'Visa Platinum® Low Rate',
      color: '#0288d1',
      image: '/images/cards/credit/card-plat-low.png',
      creditLimit: 4000,
      rewardsType: 'none',
      rewardsRate: '',
    },
    {
      type: 'visa-platinum-secured',
      name: 'Visa Platinum® Secured',
      color: '#6a1b9a',
      image: '/images/cards/credit/card-plat-secured.png',
      creditLimit: 1000,
      rewardsType: 'none',
      rewardsRate: '',
    },
  ];

  const addNewCreditCard = (option: typeof cardOptions[0]) => {
    const newCardId = `card-${Date.now()}`;
    const newCard = {
      id: newCardId,
      userId: userId,
      type: option.type,
      name: option.name,
      cardNumber: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
      expiry: '05/28',
      cvv: '•••',
      creditLimit: option.creditLimit,
      currentBalance: 0,
      availableCredit: option.creditLimit,
      dueDate: '2025-06-25',
      minimumPayment: 0,
      rewardsBalance: 0,
      rewardsType: option.rewardsType,
      rewardsRate: option.rewardsRate,
      applyDate: new Date().toISOString().split('T')[0],
      color: option.color,
      image: option.image,
    };
    setUserCards([...userCards, newCard]);
  };
  
  const addNewLoan = (type: string) => {
    const newLoanId = `loan-${Date.now()}`;
    const newLoan = {
      id: newLoanId,
      userId: userId,
      type: type,
      name: type === 'mortgage' ? 'Home Mortgage' : type === 'auto' ? 'Auto Loan' : 'Personal Loan',
      loanNumber: `LOAN-${Math.floor(100000 + Math.random() * 900000)}`,
      originalAmount: type === 'mortgage' ? 300000 : type === 'auto' ? 25000 : 10000,
      currentBalance: type === 'mortgage' ? 300000 : type === 'auto' ? 25000 : 10000,
      interestRate: type === 'mortgage' ? 4.5 : type === 'auto' ? 3.9 : 6.5,
      monthlyPayment: type === 'mortgage' ? 1520.06 : type === 'auto' ? 461.98 : 193.31,
      originationDate: new Date().toISOString().split('T')[0],
      term: type === 'mortgage' ? 30 : type === 'auto' ? 5 : 5,
      nextPaymentDate: '2025-06-01',
      paymentsMade: 0,
      paymentsRemaining: type === 'mortgage' ? 360 : 60,
    };
    setUserLoans([...userLoans, newLoan]);
  };
  
  const deleteAccount = (accountId: string) => {
    setUserAccounts(userAccounts.filter((account: any) => account.id !== accountId));
  };
  
  const deleteCard = (cardId: string) => {
    setUserCards(userCards.filter((card: any) => card.id !== cardId));
  };
  
  const deleteLoan = (loanId: string) => {
    setUserLoans(userLoans.filter((loan: any) => loan.id !== loanId));
  };
  
  const handleSave = () => {
    const updatedData = { ...bankingData };
    
    updatedData.users = updatedData.users.map((u: any) => {
      if (u.id === userId) {
        return editedUser;
      }
      return u;
    });
    
    updatedData.accounts = [
      ...bankingData.accounts.filter((account: any) => account.userId !== userId),
      ...userAccounts
    ];
    
    updatedData.creditCards = [
      ...bankingData.creditCards.filter((card: any) => card.userId !== userId),
      ...userCards
    ];
    
    updatedData.loans = [
      ...bankingData.loans.filter((loan: any) => loan.userId !== userId),
      ...userLoans
    ];
    
    onSave(updatedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-[#212121] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#212121] p-4 border-b border-neutral-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Edit User: {user.name}</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            &times;
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex border-b border-neutral-700 mb-4">
            <button 
              className={`pb-2 px-4 ${activeTab === 'profile' ? 'border-b-2 border-blue-600 text-blue-400' : 'text-neutral-400 hover:text-neutral-300'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`pb-2 px-4 ${activeTab === 'accounts' ? 'border-b-2 border-blue-600 text-blue-400' : 'text-neutral-400 hover:text-neutral-300'}`}
              onClick={() => setActiveTab('accounts')}
            >
              Accounts
            </button>
            <button 
              className={`pb-2 px-4 ${activeTab === 'cards' ? 'border-b-2 border-blue-600 text-blue-400' : 'text-neutral-400 hover:text-neutral-300'}`}
              onClick={() => setActiveTab('cards')}
            >
              Cards
            </button>
            <button 
              className={`pb-2 px-4 ${activeTab === 'loans' ? 'border-b-2 border-blue-600 text-blue-400' : 'text-neutral-400 hover:text-neutral-300'}`}
              onClick={() => setActiveTab('loans')}
            >
              Loans
            </button>
          </div>
          
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-neutral-800 text-white p-2 rounded-lg"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Occupation</label>
                <input 
                  type="text" 
                  className="w-full bg-neutral-800 text-white p-2 rounded-lg"
                  value={editedUser.occupation}
                  onChange={(e) => setEditedUser({...editedUser, occupation: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-neutral-800 text-white p-2 rounded-lg"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Phone</label>
                <input 
                  type="text" 
                  className="w-full bg-neutral-800 text-white p-2 rounded-lg"
                  value={editedUser.phone}
                  onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-neutral-400 text-sm mb-1">Annual Income</label>
                <input 
                  type="number" 
                  className="w-full bg-neutral-800 text-white p-2 rounded-lg"
                  value={editedUser.income}
                  onChange={(e) => setEditedUser({...editedUser, income: Number(e.target.value)})}
                />
              </div>
            </div>
          )}
          
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              <h3 className="text-neutral-300 font-medium">Banking Accounts</h3>
              
              {userAccounts.map((account: any) => (
                <div key={account.id} className="bg-neutral-800 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-white font-medium">{account.name}</p>
                      <p className="text-neutral-400 text-xs">{account.accountNumber}</p>
                    </div>
                    <button 
              className="text-sm bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                      onClick={() => deleteAccount(account.id)}
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-neutral-400 text-sm">Balance:</label>
                    <input 
                      type="number" 
                      className="bg-neutral-700 text-white p-1 rounded w-32 text-right"
                      value={account.balance}
                      onChange={(e) => handleAccountBalanceChange(account.id, Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="text-xs text-neutral-500 flex justify-between">
                    <span>Type: {account.type}</span>
                    <span>Interest: {account.interestRate}%</span>
                  </div>
                </div>
              ))}
              
              <div className="mt-4">
                <p className="text-neutral-400 mb-2 text-sm">Add New Account:</p>
                <div className="flex space-x-2">
                  <button 
                    className="bg-blue-900 text-white px-3 py-1 rounded text-sm"
                    onClick={() => addNewAccount('checking')}
                  >
                    + Checking
                  </button>
                  <button 
                    className="bg-blue-900 text-white px-3 py-1 rounded text-sm"
                    onClick={() => addNewAccount('savings')}
                  >
                    + Savings
                  </button>
                  <button 
                    className="bg-blue-900 text-white px-3 py-1 rounded text-sm"
                    onClick={() => addNewAccount('moneyMarket')}
                  >
                    + Money Market
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'cards' && (
            <div className="space-y-4">
              <h3 className="text-neutral-300 font-medium">Credit Cards</h3>
              
              {userCards.map((card: any) => (
                <div key={card.id} className="bg-neutral-800 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      {card.image && (
                        <img src={card.image} alt={card.name} className="w-12 h-8 rounded shadow" />
                      )}
                      <div>
                        <p className="text-white font-medium">{card.name}</p>
                        <p className="text-neutral-400 text-xs">{card.cardNumber}</p>
                      </div>
                    </div>
                    <button 
                      className="text-red-500 text-sm"
                      onClick={() => deleteCard(card.id)}
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-neutral-400 text-sm">Balance:</label>
                    <input 
                      type="number" 
                      className="bg-neutral-700 text-white p-1 rounded w-32 text-right"
                      value={card.currentBalance}
                      onChange={(e) => handleCardBalanceChange(card.id, Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-neutral-400 text-sm">Credit Limit:</label>
                    <span className="text-white">${card.creditLimit.toLocaleString()}</span>
                  </div>
                  
                  <div className="text-xs text-neutral-500">
                    <span>Available Credit: ${card.availableCredit.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              
              <div className="mt-4">
                <p className="text-neutral-400 mb-2 text-sm">Add New Credit Card:</p>
              <div className="grid grid-cols-1 gap-4">
                  {cardOptions.map((option) => (
                    <div key={option.type} className="bg-neutral-800 rounded-lg p-3 flex items-center space-x-3">
                      <img src={option.image} alt={option.name} className="w-16 h-10 rounded shadow" />
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{option.name}</p>
                        <button
                          className="mt-2 bg-blue-900 text-white px-3 py-1 rounded text-xs"
                          onClick={() => addNewCreditCard(option)}
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'loans' && (
            <div className="space-y-4">
              <h3 className="text-neutral-300 font-medium">Loans</h3>
              
              {userLoans.map((loan: any) => (
                <div key={loan.id} className="bg-neutral-800 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-white font-medium">{loan.name}</p>
                    </div>
                    <button 
                      className="text-red-500 text-sm"
                      onClick={() => deleteLoan(loan.id)}
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-neutral-400 text-sm">Current Balance:</label>
                    <input 
                      type="number" 
                      className="bg-neutral-700 text-white p-1 rounded w-32 text-right"
                      value={loan.currentBalance}
                      onChange={(e) => handleLoanBalanceChange(loan.id, Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-neutral-400 text-sm">Original Amount:</label>
                    <span className="text-white">${loan.originalAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="text-xs text-neutral-500 flex justify-between">
                    <span>Rate: {loan.interestRate}%</span>
                    <span>Payment: ${loan.monthlyPayment}/mo</span>
                  </div>
                </div>
              ))}
              
              <div className="mt-4">
                <p className="text-neutral-400 mb-2 text-sm">Add New Loan:</p>
                <div className="flex space-x-2">
                  <button 
                    className="bg-blue-900 text-white px-3 py-1 rounded text-sm"
                    onClick={() => addNewLoan('mortgage')}
                  >
                    + Mortgage
                  </button>
                  <button 
                    className="bg-blue-900 text-white px-3 py-1 rounded text-sm"
                    onClick={() => addNewLoan('auto')}
                  >
                    + Auto Loan
                  </button>
                  <button 
                    className="bg-blue-900 text-white px-3 py-1 rounded text-sm"
                    onClick={() => addNewLoan('personal')}
                  >
                    + Personal
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="sticky bottom-0 bg-[#212121] p-4 border-t border-neutral-700 flex justify-end space-x-3">
            <button 
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
