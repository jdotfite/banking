// Members 1st Credit Union Demo Banking Data Generator
// This script creates realistic fake data for demo purposes

// Utility functions
const formatCurrency = (amount) => {
    return amount.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  
  const generateAccountNumber = () => {
    return Math.floor(Math.random() * 9000000) + 1000000;
  };
    const generateCardNumber = () => {
    return `**** **** **** ${Math.floor(Math.random() * 9000) + 1000}`;
  };
  
  const generateLoanNumber = () => {
    return `LOAN-${Math.floor(Math.random() * 900000) + 100000}`;
  };
  
  const generateRandomAmount = (min, max) => {
    return Number((Math.random() * (max - min) + min).toFixed(2));
  };
  
  // Transaction generation utilities
  const merchants = [
    { name: 'Starbucks', category: 'dining', icon: 'coffee', averageAmount: 5.45, frequency: 'high' },
    { name: 'Whole Foods', category: 'groceries', icon: 'shopping', averageAmount: 85.32, frequency: 'medium' },
    { name: 'Amazon', category: 'shopping', icon: 'shopping', averageAmount: 35.47, frequency: 'medium' },
    { name: 'Netflix', category: 'subscription', icon: 'entertainment', averageAmount: 14.99, frequency: 'monthly' },
    { name: 'Target', category: 'shopping', icon: 'shopping', averageAmount: 65.32, frequency: 'medium' },
    { name: 'Uber', category: 'transport', icon: 'car', averageAmount: 24.50, frequency: 'medium' },
    { name: 'AT&T', category: 'utilities', icon: 'utilities', averageAmount: 89.99, frequency: 'monthly' },
    { name: 'Chevron', category: 'transport', icon: 'car', averageAmount: 48.75, frequency: 'medium' },
    { name: 'Giant Food', category: 'groceries', icon: 'shopping', averageAmount: 125.45, frequency: 'medium' },
    { name: 'Home Depot', category: 'home', icon: 'shopping', averageAmount: 87.35, frequency: 'low' },
    { name: 'Chipotle', category: 'dining', icon: 'food', averageAmount: 18.25, frequency: 'medium' },
    { name: 'Spotify', category: 'subscription', icon: 'entertainment', averageAmount: 9.99, frequency: 'monthly' },
    { name: 'CVS Pharmacy', category: 'health', icon: 'health', averageAmount: 32.50, frequency: 'low' },
    { name: 'PetSmart', category: 'pets', icon: 'shopping', averageAmount: 45.75, frequency: 'low' },
    { name: 'AMC Theaters', category: 'entertainment', icon: 'entertainment', averageAmount: 28.50, frequency: 'low' }
  ];
  
  const locations = {
    'Starbucks': ['East Shore', 'Camp Hill', 'Mechanicsburg'],
    'Target': ['Harrisburg', 'Colonial Park'],
    'Chipotle': ['Camp Hill', 'Carlisle Pike'],
    'Home Depot': ['Mechanicsburg', 'Carlisle'],
    'Giant Food': ['Linglestown Rd', 'Camp Hill', 'Carlisle Pike'],
    'Chevron': ['Jonestown Rd', 'Carlisle Pike', 'Cameron St'],
    'CVS Pharmacy': ['Market St', 'Camp Hill', 'Mechanicsburg'],
    'AMC Theaters': ['Colonial Park Mall']
  };
  
  const getRandomLocation = (merchantName) => {
    if (locations[merchantName]) {
      const locs = locations[merchantName];
      return locs[Math.floor(Math.random() * locs.length)];
    }
    return null;
  };
  
  const getRandomTime = () => {
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = Math.floor(Math.random() * 60);
    const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
    return `${hours}:${minutes.toString().padStart(2, '0')}${ampm}`;
  };
  
  const generateId = () => {
    return Math.random().toString(36).substring(2, 11);
  };
  
  const selectWeightedMerchant = (merchants) => {
    // Simple weighted selection
    const frequencyWeights = {
      'high': 0.5,
      'medium': 0.3,
      'low': 0.15,
      'monthly': 0.05
    };
    
    // Calculate total weight
    const totalWeight = merchants.reduce((sum, merchant) => {
      return sum + frequencyWeights[merchant.frequency];
    }, 0);
    
    // Select based on weight
    let random = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    
    for (const merchant of merchants) {
      cumulativeWeight += frequencyWeights[merchant.frequency];
      if (random <= cumulativeWeight) {
        return merchant;
      }
    }
    
    return merchants[0]; // Fallback
  };
    // Generate transactions for a specific account
  const createTransactions = (userId, accountId, months = 3) => {
    const transactions = [];
    const currentDate = new Date();
    
    // Create 3 months of transaction history
    for (let day = 0; day < (months * 30); day++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - day);
      
      // Add 0-5 transactions per day (weighted toward fewer)
      const dailyTransactionCount = Math.floor(Math.random() * 3) + (day % 7 === 5 ? 3 : 0); // More on weekends
      
      for (let t = 0; t < dailyTransactionCount; t++) {
        // Select random merchant with weighting toward frequent ones
        const merchant = selectWeightedMerchant(merchants);
        
        // Vary amount slightly from average
        const amount = merchant.averageAmount * (0.85 + (Math.random() * 0.3));
        const location = getRandomLocation(merchant.name);
        
        transactions.push({
          id: `txn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId,
          accountId,
          date: date.toISOString(),
          merchant: merchant.name,
          category: merchant.category,
          icon: merchant.icon,
          amount: parseFloat(amount.toFixed(2)),
          isIncoming: Math.random() < 0.15, // 15% are income/refunds
          status: 'completed',
          location: location,
          message: location ? null : 'Online Purchase',
          timestamp: getRandomTime()
        });
      }
      
      // Add monthly salary for employed person on appropriate days
      if (userId === 'user1' && (day % 14 === 0)) { // Bi-weekly payroll
        transactions.push({
          id: `txn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId,
          accountId,
          date: date.toISOString(),
          merchant: 'Payroll Deposit',
          category: 'income',
          icon: 'payroll',
          amount: 2654.33, // Net bi-weekly pay
          isIncoming: true,
          status: 'completed',
          message: 'Direct Deposit - Salary',
          timestamp: '9:00AM'
        });
      }
      
      // Monthly retirement income for second user
      if (userId === 'user2' && (day % 30 === 1)) {
        transactions.push({
          id: `txn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId,
          accountId,
          date: date.toISOString(),
          merchant: 'Social Security',
          category: 'income',
          icon: 'payroll',
          amount: 2218.00,
          isIncoming: true,
          status: 'completed',
          message: 'Direct Deposit - SS Benefit',
          timestamp: '3:30AM'
        });
      }
      
      // Add monthly mortgage/rent payments
      if (day % 30 === 5) {
        transactions.push({
          id: `txn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId,
          accountId,
          date: date.toISOString(),
          merchant: userId === 'user1' ? 'Members 1st Mortgage' : 'Sunset Apartments',
          category: 'housing',
          icon: 'home',
          amount: userId === 'user1' ? 1456.33 : 1100.00,
          isIncoming: false,
          status: 'completed',
          message: userId === 'user1' ? 'Monthly Mortgage Payment' : 'Rent Payment',
          timestamp: '8:00AM'
        });
      }
    }
      return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Generate credit card transactions for a specific card
  const createCreditCardTransactions = (userId, cardId, months = 3) => {
    const transactions = [];
    const currentDate = new Date();
    
    // Credit card specific merchants (more common for cards)
    const cardMerchants = [
      { name: 'Amazon', category: 'shopping', icon: 'shopping', averageAmount: 45.32, frequency: 'high' },
      { name: 'Starbucks', category: 'dining', icon: 'coffee', averageAmount: 6.75, frequency: 'high' },
      { name: 'Target', category: 'shopping', icon: 'shopping', averageAmount: 85.50, frequency: 'medium' },
      { name: 'Uber Eats', category: 'dining', icon: 'food', averageAmount: 28.45, frequency: 'medium' },
      { name: 'Netflix', category: 'subscription', icon: 'entertainment', averageAmount: 14.99, frequency: 'monthly' },
      { name: 'Spotify', category: 'subscription', icon: 'entertainment', averageAmount: 9.99, frequency: 'monthly' },
      { name: 'Best Buy', category: 'electronics', icon: 'shopping', averageAmount: 120.75, frequency: 'low' },
      { name: 'Whole Foods', category: 'groceries', icon: 'shopping', averageAmount: 95.25, frequency: 'medium' },
      { name: 'Chipotle', category: 'dining', icon: 'food', averageAmount: 12.85, frequency: 'medium' },
      { name: 'Home Depot', category: 'home', icon: 'shopping', averageAmount: 156.90, frequency: 'low' },
      { name: 'Shell', category: 'gas', icon: 'car', averageAmount: 52.30, frequency: 'medium' },
      { name: 'Apple Store', category: 'electronics', icon: 'shopping', averageAmount: 89.99, frequency: 'low' },
      { name: 'Instacart', category: 'groceries', icon: 'shopping', averageAmount: 67.45, frequency: 'medium' },
      { name: 'DoorDash', category: 'dining', icon: 'food', averageAmount: 35.20, frequency: 'medium' },
      { name: 'Barnes & Noble', category: 'books', icon: 'shopping', averageAmount: 28.99, frequency: 'low' }
    ];
    
    // Create 3 months of credit card transaction history
    for (let day = 0; day < (months * 30); day++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - day);
      
      // Credit cards have more transactions (1-6 per day)
      const dailyTransactionCount = Math.floor(Math.random() * 4) + (day % 7 >= 5 ? 2 : 0); // More on weekends
      
      for (let t = 0; t < dailyTransactionCount; t++) {
        // Select random merchant with weighting toward frequent ones
        const merchant = selectWeightedMerchant(cardMerchants);
        
        // Vary amount slightly from average
        const amount = merchant.averageAmount * (0.8 + (Math.random() * 0.4));
        const location = getRandomLocation(merchant.name);
        
        transactions.push({
          id: `cc-txn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId,
          cardId,
          date: date.toISOString(),
          merchant: merchant.name,
          category: merchant.category,
          icon: merchant.icon,
          amount: parseFloat(amount.toFixed(2)),
          isCredit: Math.random() < 0.08, // 8% are credits/refunds
          status: 'posted',
          location: location,
          message: location ? null : 'Online Purchase',
          timestamp: getRandomTime(),
          type: 'purchase'
        });
      }
      
      // Add monthly payment
      if (day % 30 === 15) {
        transactions.push({
          id: `cc-payment-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId,
          cardId,
          date: date.toISOString(),
          merchant: 'Payment - Thank You',
          category: 'payment',
          icon: 'payment',
          amount: Math.floor(Math.random() * 500) + 100, // $100-600 payment
          isCredit: true,
          status: 'posted',
          message: 'Online Payment',
          timestamp: '12:00PM',
          type: 'payment'
        });
      }
    }
    
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  
  // Group transactions by date (TODAY, YESTERDAY, or formatted date)
  const groupTransactionsByDate = (transactions) => {
    const today = new Date().toLocaleDateString();
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();
    
    const grouped = transactions.reduce((groups, transaction) => {
      const txDate = new Date(transaction.date).toLocaleDateString();
      let dateLabel;
      
      if (txDate === today) {
        dateLabel = 'TODAY';
      } else if (txDate === yesterday) {
        dateLabel = 'YESTERDAY';
      } else {
        dateLabel = new Date(transaction.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric', 
          year: 'numeric'
        }).toUpperCase();
      }
      
      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      
      groups[dateLabel].push(transaction);
      return groups;
    }, {});
    
    // Format for component
    return Object.keys(grouped).map(date => ({
      date,
      transactions: grouped[date]
    }));
  };
  
  // Create fake users with complete financial profiles
  const generateFakeUsers = () => {
    // --- USER 1: Young Professional ---
    const user1 = {
      id: 'user1',
      name: 'Jessica Coleman',
      username: 'jcoleman',
      email: 'j.coleman@example.com',
      avatar: '/images/avatar/jess-coleman.png',
      phone: '(717) 555-1234',
      address: '123 Pine Street, Harrisburg, PA 17101',
      ssn: '•••-••-7890',
      dob: '1992-05-15',
      occupation: 'Marketing Manager',
      income: 85000,
      joinDate: '2019-03-22',
      lastLogin: new Date().toISOString()
    };
    
    // --- USER 2: Retired Individual ---
    const user2 = {
      id: 'user2',
      name: 'Robert Thompson',
      username: 'rthompson',
      email: 'r.thompson@example.com',
      avatar: '/images/avatar/robert-thompson.png',
      phone: '(717) 555-8765',
      address: '456 Oak Avenue, Mechanicsburg, PA 17055',
      ssn: '•••-••-4321',
      dob: '1958-09-30',
      occupation: 'Retired (Former Teacher)',
      income: 52000, // Combined retirement income
      joinDate: '2002-07-14',
      lastLogin: new Date().toISOString()
    };
    
    // Banking Products for User 1
    const user1Accounts = [
      {
        id: 'acct-1001',
        userId: 'user1',
        type: 'checking',
        name: 'Members 1st Checking',
        accountNumber: `****${generateAccountNumber().toString().slice(-4)}`,
        routingNumber: '231382241',
        balance: 3427.59,
        availableBalance: 3227.59,
        pendingTransactions: 2,
        interestRate: 0.05,
        openDate: '2019-03-22'
      },
      {
        id: 'acct-1002',
        userId: 'user1',
        type: 'savings',
        name: 'Members 1st Savings',
        accountNumber: `****${generateAccountNumber().toString().slice(-4)}`,
        routingNumber: '231382241',
        balance: 15750.33,
        interestRate: 1.75,
        openDate: '2019-03-22'
      },
      {
        id: 'acct-1003',
        userId: 'user1',
        type: 'moneyMarket',
        name: 'Money Market Account',
        accountNumber: `****${generateAccountNumber().toString().slice(-4)}`,
        routingNumber: '231382241',
        balance: 25000.00,
        interestRate: 2.25,
        openDate: '2020-11-15'
      }
    ];
    
    // Banking Products for User 2
    const user2Accounts = [
      {
        id: 'acct-2001',
        userId: 'user2',
        type: 'checking',
        name: 'Members 1st Checking',
        accountNumber: `****${generateAccountNumber().toString().slice(-4)}`,
        routingNumber: '231382241',
        balance: 4850.26,
        availableBalance: 4850.26,
        pendingTransactions: 0,
        interestRate: 0.05,
        openDate: '2002-07-14'
      },
      {
        id: 'acct-2002',
        userId: 'user2',
        type: 'savings',
        name: 'Members 1st Savings',
        accountNumber: `****${generateAccountNumber().toString().slice(-4)}`,
        routingNumber: '231382241',
        balance: 42365.78,
        interestRate: 1.75,
        openDate: '2002-07-14'
      },
      {
        id: 'acct-2003',
        userId: 'user2',
        type: 'cd',
        name: '11-Month Certificate',
        accountNumber: `****${generateAccountNumber().toString().slice(-4)}`,
        routingNumber: '231382241',
        balance: 10000.00,
        interestRate: 4.00, // APY
        openDate: '2024-09-01',
        maturityDate: '2025-08-01'
      }
    ];
    
    // Credit Cards
    const creditCards = [      {
        id: 'card-5001',
        userId: 'user1',
        type: 'visa',
        name: 'Visa Signature Rewards',
        cardNumber: '**** **** **** 9891',
        expiry: '05/27',
        cvv: '•••',
        creditLimit: 12000,
        currentBalance: 2427.50,
        availableCredit: 9572.50,
        dueDate: '2025-05-25',
        minimumPayment: 35.00,
        rewardsBalance: 342.89,
        rewardsType: 'cashback',
        rewardsRate: '1.5%',
        applyDate: '2020-04-15',
        color: '#7b2528' // Red color for card design
      },      {
        id: 'card-5002',
        userId: 'user2', 
        type: 'visa',
        name: 'Visa Platinum Low Rate',
        cardNumber: '**** **** **** 5432',
        expiry: '09/26',
        cvv: '•••',
        creditLimit: 8000,
        currentBalance: 1256.78,
        availableCredit: 6743.22,
        dueDate: '2025-05-15',
        minimumPayment: 25.00,
        rewardsBalance: 0,
        rewardsType: 'none',
        rewardsRate: '0%',
        applyDate: '2015-02-10',
        color: '#333333' // Dark gray for card design
      },
      {
        id: 'card-5003',
        userId: 'user1',
        type: 'visa',
        name: 'Platinum Business Rewards',
        cardNumber: '**** **** **** 7812',
        expiry: '09/27',
        cvv: '•••',
        creditLimit: 12000,
        currentBalance: 3500.25,
        availableCredit: 8499.75,
        dueDate: '2025-06-10',
        minimumPayment: 70.00,
        rewardsBalance: 186.45,
        rewardsType: 'points',
        rewardsRate: '2x',
        applyDate: '2021-09-15',
        color: '#581c5c' // Purple color for card design
      },
      {
        id: 'card-5004',
        userId: 'user1',
        type: 'visa',
        name: 'Platinum Rewards',
        cardNumber: '**** **** **** 9087',
        expiry: '03/29',
        cvv: '•••',
        creditLimit: 15000,
        currentBalance: 1850.33,
        availableCredit: 13149.67,
        dueDate: '2025-06-05',
        minimumPayment: 45.00,
        rewardsBalance: 297.82,
        rewardsType: 'cashback',
        rewardsRate: '1.8%',
        applyDate: '2022-03-20',
        color: '#1a6844' // Green color for card design
      },
      {
        id: 'card-5005',
        userId: 'user1',
        type: 'visa',
        name: 'Platinum Secured',
        cardNumber: '**** **** **** 4521',
        expiry: '05/28',
        cvv: '•••',
        creditLimit: 5000,
        currentBalance: 750.00,
        availableCredit: 4250.00,
        dueDate: '2025-05-30',
        minimumPayment: 25.00,
        rewardsBalance: 0,
        rewardsType: 'none',
        rewardsRate: '0%',
        applyDate: '2023-05-12',
        color: '#614b19' // Gold color for card design
      }
    ];
    
    // Loans
    const loans = [
      {
        id: 'loan-7001',
        userId: 'user1',
        type: 'mortgage',
        name: 'Home Mortgage',
        loanNumber: generateLoanNumber(),
        originalAmount: 320000,
        currentBalance: 287650.50,
        interestRate: 4.25,
        monthlyPayment: 1456.33,
        originationDate: '2020-08-15',
        term: 30, // years
        nextPaymentDate: '2025-06-01',
        paymentsMade: 58,
        paymentsRemaining: 302,
        propertyAddress: '123 Pine Street, Harrisburg, PA 17101'
      },
      {
        id: 'loan-7002',
        userId: 'user1',
        type: 'auto',
        name: 'Auto Loan',
        loanNumber: generateLoanNumber(),
        originalAmount: 32000,
        currentBalance: 18743.21,
        interestRate: 3.25,
        monthlyPayment: 505.86,
        originationDate: '2022-11-10',
        term: 5, // years
        nextPaymentDate: '2025-06-05',
        paymentsMade: 18,
        paymentsRemaining: 42,
        vehicle: '2022 Honda CR-V',
        vin: 'JH4KA7650MC034521'
      },
      {
        id: 'loan-7003',
        userId: 'user2',
        type: 'homeEquity',
        name: 'Home Equity Freedom Line of Credit',
        loanNumber: generateLoanNumber(),
        originalAmount: 50000, // Credit line
        currentBalance: 15000, // Current used amount
        availableCredit: 35000,
        interestRate: 6.25,
        monthlyPayment: 250.00, // Minimum payment
        originationDate: '2022-01-18',
        term: 15, // years
        nextPaymentDate: '2025-06-10',
        paymentsMade: 28,
        paymentsRemaining: 152,
        propertyAddress: '456 Oak Avenue, Mechanicsburg, PA 17055'
      }
    ];
      // Generate transactions for each account
    const user1Transactions = {};
    const user2Transactions = {};
    
    user1Accounts.forEach(account => {
      user1Transactions[account.id] = createTransactions('user1', account.id, 3);
    });
    
    user2Accounts.forEach(account => {
      user2Transactions[account.id] = createTransactions('user2', account.id, 3);
    });

    // Generate credit card transactions
    const creditCardTransactions = {};
    creditCards.forEach(card => {
      creditCardTransactions[card.id] = createCreditCardTransactions(card.userId, card.id, 3);
    });
    
    // Format transactions for card view
    const user1GroupedTransactions = groupTransactionsByDate(
      user1Transactions[user1Accounts[0].id]
    );
    const user2GroupedTransactions = groupTransactionsByDate(
      user2Transactions[user2Accounts[0].id]
    );
    
    // --- NEW USER: Basic Demo User ---
    const newUser = {
      id: 'user3',
      name: 'New User',
      username: 'newuser',
      email: 'new.user@example.com',
      avatar: '/images/avatar/default.png',
      phone: '(717) 555-0000',
      address: '789 Demo Lane, Harrisburg, PA 17101',
      ssn: '•••-••-0000',
      dob: '1990-01-01',
      occupation: 'Demo User',
      income: 0,
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString()
    };

    // Accounts for New User
    const newUserAccounts = [
      {
        id: 'acct-3001',
        userId: 'user3',
        type: 'checking',
        name: 'Members 1st Checking',
        accountNumber: `****${generateAccountNumber().toString().slice(-4)}`,
        routingNumber: '231382241',
        balance: 100.00,
        availableBalance: 100.00,
        pendingTransactions: 0,
        interestRate: 0.05,
        openDate: new Date().toISOString().split('T')[0]
      },
      {
        id: 'acct-3002',
        userId: 'user3',
        type: 'savings',
        name: 'Members 1st Savings',
        accountNumber: `****${generateAccountNumber().toString().slice(-4)}`,
        routingNumber: '231382241',
        balance: 5.00,
        interestRate: 1.75,
        openDate: new Date().toISOString().split('T')[0]
      }
    ];

    // Empty transactions for New User
    const newUserTransactions = {};
    newUserAccounts.forEach(account => {
      newUserTransactions[account.id] = [];
    });
  /** @type {import('@/lib/types/bankingDataTypes').BankingData} */
  const bankingData = {
    users: [user1, user2, newUser],
    accounts: [...user1Accounts, ...user2Accounts, ...newUserAccounts].map(account => ({
      ...account,
      type: /** @type {'checking'|'savings'|'moneyMarket'|'cd'} */ (account.type)
    })),
    creditCards,
    loans,
    transactions: {
      user1: user1Transactions,
      user2: user2Transactions,
      user3: newUserTransactions
    },
    creditCardTransactions,
    groupedTransactions: {
      user1: user1GroupedTransactions,
      user2: user2GroupedTransactions,
      user3: []
    }
  };
  return bankingData;
  };
  
  // Export the generator function as default
  export default generateFakeUsers;
