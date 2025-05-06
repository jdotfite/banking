// components/ui/icons/Icon.tsx
import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  // Map for standard icons (navigation, UI elements, etc.)
  const standardIconMap: Record<string, any> = {
    car: LucideIcons.Car,
    deposit: LucideIcons.PlusCircle,
    home: LucideIcons.Home,
    insights: LucideIcons.LineChart,
    add: LucideIcons.Plus,
    wallet: LucideIcons.Wallet,
    more: LucideIcons.MoreHorizontal,
    shopping: LucideIcons.ShoppingBag,
    transfer: LucideIcons.ArrowLeftRight, // Using the correct name from documentation
    subscription: LucideIcons.Repeat,
    entertainment: LucideIcons.Music,
    notificationBell: LucideIcons.Bell,
    repeat: LucideIcons.Repeat, // For pay button
    card: LucideIcons.CreditCard, // For credit card navigation
    withdraw: LucideIcons.MinusCircle, // For withdraw action
    settings: LucideIcons.Settings, // For settings
  };

  // Map for merchant-specific icons
  const merchantIconMap: Record<string, any> = {
    netflix: LucideIcons.Tv,
    spotify: LucideIcons.Music,
    amazon: LucideIcons.ShoppingCart,
    uber: LucideIcons.Car,
    starbucks: LucideIcons.Coffee,
    zara: LucideIcons.ShoppingBag,
    payroll: LucideIcons.Landmark,
  };

  // Map for category-specific icons
  const categoryIconMap: Record<string, any> = {
    food: LucideIcons.UtensilsCrossed,
    dining: LucideIcons.UtensilsCrossed,
    travel: LucideIcons.Plane,
    transport: LucideIcons.Bus,
    utilities: LucideIcons.Lightbulb,
    health: LucideIcons.Stethoscope,
    coffee: LucideIcons.Coffee,
  };

  // Try to render the icon based on name
  // First check standard icons, then merchant icons, then category icons
  const IconComponent = standardIconMap[name] || merchantIconMap[name] || categoryIconMap[name] || LucideIcons.CreditCard;
  
  return <IconComponent className={className} />;
};

export default Icon;
