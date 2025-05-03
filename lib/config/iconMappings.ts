/**
 * Icon Mappings Configuration
 * 
 * This file contains all icon mappings used throughout the application.
 * Centralizing these mappings makes it easier to maintain and update icons.
 */

import * as LucideIcons from 'lucide-react';

/**
 * Standard UI icons used for navigation, buttons, and general UI elements
 */
export const standardIconMap: Record<string, any> = {
  // Navigation icons
  home: LucideIcons.Home,
  wallet: LucideIcons.Wallet,
  insights: LucideIcons.LineChart,
  deposit: LucideIcons.PlusCircle,
  transfer: LucideIcons.ArrowLeftRight,
  more: LucideIcons.MoreHorizontal,
  
  // Action icons
  add: LucideIcons.Plus,
  edit: LucideIcons.Edit,
  delete: LucideIcons.Trash,
  search: LucideIcons.Search,
  settings: LucideIcons.Settings,
  
  // Notification icons
  notificationBell: LucideIcons.Bell,
  alert: LucideIcons.AlertTriangle,
  info: LucideIcons.Info,
  
  // Payment icons
  repeat: LucideIcons.Repeat, // For recurring payments
  calendar: LucideIcons.Calendar, // For scheduled payments
  
  // Misc UI icons
  chevronDown: LucideIcons.ChevronDown,
  chevronUp: LucideIcons.ChevronUp,
  chevronLeft: LucideIcons.ChevronLeft,
  chevronRight: LucideIcons.ChevronRight,
  close: LucideIcons.X,
  check: LucideIcons.Check,
  lock: LucideIcons.Lock,
  unlock: LucideIcons.Unlock,
};

/**
 * Merchant-specific icons for transaction displays
 */
export const merchantIconMap: Record<string, any> = {
  // Streaming services
  netflix: LucideIcons.Tv,
  hulu: LucideIcons.Tv,
  disney: LucideIcons.Tv,
  
  // Music services
  spotify: LucideIcons.Music,
  appleMusic: LucideIcons.Music,
  
  // Shopping
  amazon: LucideIcons.ShoppingCart,
  target: LucideIcons.ShoppingBag,
  walmart: LucideIcons.ShoppingBag,
  zara: LucideIcons.ShoppingBag,
  
  // Transportation
  uber: LucideIcons.Car,
  lyft: LucideIcons.Car,
  
  // Food & Drink
  starbucks: LucideIcons.Coffee,
  mcdonalds: LucideIcons.UtensilsCrossed,
  chipotle: LucideIcons.UtensilsCrossed,
  
  // Financial
  payroll: LucideIcons.Landmark,
  venmo: LucideIcons.DollarSign,
  paypal: LucideIcons.DollarSign,
};

/**
 * Category-specific icons for transaction categorization
 */
export const categoryIconMap: Record<string, any> = {
  // Food & Dining
  food: LucideIcons.UtensilsCrossed,
  dining: LucideIcons.UtensilsCrossed,
  groceries: LucideIcons.ShoppingCart,
  coffee: LucideIcons.Coffee,
  
  // Transportation
  transport: LucideIcons.Bus,
  travel: LucideIcons.Plane,
  gas: LucideIcons.Fuel,
  
  // Housing & Utilities
  utilities: LucideIcons.Lightbulb,
  rent: LucideIcons.Home,
  mortgage: LucideIcons.Home,
  home: LucideIcons.Home,
  
  // Shopping
  shopping: LucideIcons.ShoppingBag,
  clothing: LucideIcons.Shirt,
  electronics: LucideIcons.Smartphone,
  
  // Health & Wellness
  health: LucideIcons.Stethoscope,
  fitness: LucideIcons.Dumbbell,
  medical: LucideIcons.Heart, // Using Heart instead of FirstAid which isn't available
  
  // Entertainment
  entertainment: LucideIcons.Music,
  subscription: LucideIcons.Repeat,
  movies: LucideIcons.Film,
  
  // Financial
  income: LucideIcons.TrendingUp,
  investment: LucideIcons.LineChart,
  savings: LucideIcons.PiggyBank,
  
  // Other
  other: LucideIcons.CircleDot,
  uncategorized: LucideIcons.HelpCircle,
};

/**
 * Get the appropriate icon component based on name
 * Checks all icon maps in order of priority
 */
export const getIconByName = (name: string): any => {
  return (
    standardIconMap[name] || 
    merchantIconMap[name] || 
    categoryIconMap[name] || 
    LucideIcons.CreditCard // Default fallback icon
  );
};
