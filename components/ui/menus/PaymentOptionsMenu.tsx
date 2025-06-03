import React from 'react';
import Icon from '@/components/ui/icons/Icon';
import { ChevronRight } from 'lucide-react';

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
      icon: 'lock',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400'
    },
    {
      id: 'alerts-notifications',
      title: 'Alerts & notifications',
      description: 'Customize your card alerts and notifications',
      icon: 'notificationBell',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400'
    },
    {
      id: 'merchant-settings',
      title: 'Merchant settings',
      description: 'Manage merchant preferences and restrictions',
      icon: 'shopping',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400'
    },
    {
      id: 'transaction-settings',
      title: 'Transaction settings',
      description: 'Configure transaction limits and preferences',
      icon: 'settings',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-400'
    },    {
      id: 'card-support',
      title: 'Card support',
      description: 'Get help with your card or report issues',
      icon: 'info',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400'
    },
    {
      id: 'payment-limits',
      title: 'Payment limits',
      description: 'Set daily and monthly payment limits',
      icon: 'wallet',
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400'
    }
  ];

  const handleItemClick = (item: PaymentOption) => {
    console.log(`${item.title} clicked`);
    if (onItemClick) {
      onItemClick(item);
    }
    // Optionally close the sheet after selection
    // if (onClose) onClose();
  };  return (
    <div className="p-4 pb-8">
      {/* Header to indicate available options */}
      <div className="mb-3 px-1">
        <h3 className="text-base font-medium text-neutral-400">Card Management</h3>
      </div>
      
      {/* Menu items with increased spacing */}
      <div className="space-y-2">
        {paymentOptions.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center p-4 hover:bg-neutral-700/30 rounded-lg transition-colors text-left group"
            onClick={() => handleItemClick(item)}
          >            <div className={`w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center mr-3 group-hover:scale-105 transition-transform`}>
              <Icon name={item.icon} className="text-neutral-300 text-lg" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">{item.title}</h3>
              <p className="text-sm text-neutral-400">{item.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
          </button>
        ))}
      </div>
      
      {/* Extra space at bottom to ensure last items are visible */}
      <div className="h-16"></div>
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
