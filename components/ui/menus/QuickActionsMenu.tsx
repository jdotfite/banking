import React from 'react';

// Quick Actions Menu Component (reusable for other pages)
export interface QuickAction {
  id: string;
  title: string;
  icon: string;
}

export interface QuickActionsMenuProps {
  onItemClick?: (action: QuickAction) => void;
  theme?: 'light' | 'dark';
}

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({ onItemClick, theme = 'light' }) => {
  const actions: QuickAction[] = [
    { id: 'transfer', title: 'Transfer Money', icon: '💸' },
    { id: 'pay-bill', title: 'Pay Bill', icon: '📄' },
    { id: 'request', title: 'Request Payment', icon: '📥' },
    { id: 'scan', title: 'Scan QR Code', icon: '📱' }
  ];

  const isDark = theme === 'dark';
  const itemBgClass = isDark ? 'bg-neutral-700/30 hover:bg-neutral-600/40' : 'bg-gray-50 hover:bg-gray-100';
  const textClass = isDark ? 'text-white' : 'text-gray-700';

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`flex flex-col items-center p-4 ${itemBgClass} rounded-lg transition-colors group`}
            onClick={() => onItemClick?.(action)}
          >
            <span className="text-3xl mb-2 group-hover:scale-105 transition-transform">{action.icon}</span>
            <span className={`text-sm font-medium ${textClass}`}>{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
