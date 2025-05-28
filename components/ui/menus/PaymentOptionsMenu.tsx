import React from 'react';

// Payment Options Menu Component for Cards Page
export interface PaymentOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export interface PaymentOptionsMenuProps {
  onItemClick?: (item: PaymentOption) => void;
  onClose?: () => void;
}

export const PaymentOptionsMenu: React.FC<PaymentOptionsMenuProps> = ({ onItemClick, onClose }) => {  const paymentOptions: PaymentOption[] = [    {
      id: 'manage-pin',
      title: 'Manage PIN',
      description: 'Change or reset your card PIN',
      icon: '🔑',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400'
    },
    {
      id: 'alerts-notifications',
      title: 'Alerts & notifications',
      description: 'Customize your card alerts and notifications',
      icon: '🔔',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400'
    },
    {
      id: 'merchant-settings',
      title: 'Merchant settings',
      description: 'Manage merchant preferences and restrictions',
      icon: '🏪',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400'
    },
    {
      id: 'transaction-settings',
      title: 'Transaction settings',
      description: 'Configure transaction limits and preferences',
      icon: '⚙️',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-400'
    },    {
      id: 'card-support',
      title: 'Card support',
      description: 'Get help with your card or report issues',
      icon: '🙋',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400'
    },
    {
      id: 'payment-limits',
      title: 'Payment limits',
      description: 'Set daily and monthly payment limits',
      icon: '💰',
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400'
    },
    {
      id: 'virtual-card',
      title: 'Virtual card',
      description: 'Create and manage virtual cards',
      icon: '💳',
      iconBg: 'bg-indigo-500/20',
      iconColor: 'text-indigo-400'
    },
    {
      id: 'fraud-protection',
      title: 'Fraud protection',
      description: 'Advanced security and fraud monitoring',
      icon: '🛡️',
      iconBg: 'bg-cyan-500/20',
      iconColor: 'text-cyan-400'
    },
    {
      id: 'international-usage',
      title: 'International usage',
      description: 'Enable card usage for international transactions',
      icon: '🌍',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400'
    },
    {
      id: 'contactless-payments',
      title: 'Contactless payments',
      description: 'Manage tap-to-pay and contactless settings',
      icon: '📱',
      iconBg: 'bg-pink-500/20',
      iconColor: 'text-pink-400'
    }
  ];

  const handleItemClick = (item: PaymentOption) => {
    console.log(`${item.title} clicked`);
    if (onItemClick) {
      onItemClick(item);
    }
    // Optionally close the sheet after selection
    // if (onClose) onClose();
  };

  return (
    <div className="p-4">
      <div className="space-y-1">
        {paymentOptions.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center p-4 hover:bg-neutral-700/30 rounded-lg transition-colors text-left group"
            onClick={() => handleItemClick(item)}
          >
            <div className={`w-10 h-10 ${item.iconBg} rounded-full flex items-center justify-center mr-3 group-hover:scale-105 transition-transform`}>
              <span className={`${item.iconColor} text-lg`}>{item.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">{item.title}</h3>
              <p className="text-sm text-neutral-400">{item.description}</p>
            </div>
            <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors">›</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Quick Actions Menu Component (reusable for other pages)
export interface QuickAction {
  id: string;
  title: string;
  icon: string;
}

export interface QuickActionsMenuProps {
  onItemClick?: (action: QuickAction) => void;
}

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({ onItemClick }) => {
  const actions: QuickAction[] = [
    { id: 'transfer', title: 'Transfer Money', icon: '💸' },
    { id: 'pay-bill', title: 'Pay Bill', icon: '📄' },
    { id: 'request', title: 'Request Payment', icon: '📥' },
    { id: 'scan', title: 'Scan QR Code', icon: '📱' }
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            className="flex flex-col items-center p-4 bg-neutral-700/30 hover:bg-neutral-600/40 rounded-lg transition-colors group"
            onClick={() => onItemClick?.(action)}
          >
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</span>
            <span className="text-sm font-medium text-neutral-200">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
