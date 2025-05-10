/**
 * Icon Mappings Configuration
 * 
 * This file contains all icon mappings used throughout the application.
 * Centralizing these mappings makes it easier to maintain and update icons.
 */

import * as LucideIcons from 'lucide-react';

// Import brand icons from react-icons
import { 
  FaAmazon, FaWalmart, FaTarget, FaSpotify, FaNetflix, 
  FaUber, FaPaypal, FaApple, FaStarbucks, FaCreditCard,
  FaEbay, FaDisney, FaVenmo, FaMusic, FaShoppingCart,
  FaShoppingBag, FaCoffee, FaUtensils, FaCar, FaDollarSign,
  FaTv
} from 'react-icons/fa';

// Import more brand icons from Simple Icons set in react-icons
import {
  SiZara, SiChipotle, SiMcdonalds, SiLyft, SiHulu,
  SiVenmo, SiNetflix
} from 'react-icons/si';

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
 * Enhanced with brand icons from react-icons
 */
export const merchantIconMap: Record<string, any> = {
  // Streaming services
  netflix: SiNetflix || FaNetflix || LucideIcons.Tv,
  hulu: SiHulu || FaTv,
  disney: FaDisney || LucideIcons.Tv,
  
  // Music services
  spotify: FaSpotify,
  appleMusic: FaMusic,
  
  // Shopping
  amazon: FaAmazon,
  target: FaTarget,
  walmart: FaWalmart,
  zara: SiZara,
  ebay: FaEbay,
  
  // Transportation
  uber: FaUber,
  lyft: SiLyft,
  
  // Food & Drink
  starbucks: FaStarbucks,
  mcdonalds: SiMcdonalds,
  chipotle: SiChipotle,
  
  // Financial
  payroll: LucideIcons.Landmark,
  venmo: SiVenmo || FaVenmo,
  paypal: FaPaypal,
};

/**
 * Category-specific icons for transaction categorization
 */
export const categoryIconMap: Record<string, any> = {
  // Food & Dining
  food: FaUtensils || LucideIcons.UtensilsCrossed,
  dining: FaUtensils || LucideIcons.UtensilsCrossed,
  groceries: FaShoppingCart,
  coffee: FaCoffee,
  
  // Transportation
  transport: LucideIcons.Bus,
  travel: LucideIcons.Plane,
  gas: LucideIcons.Fuel,
  car: FaCar,
  
  // Housing & Utilities
  utilities: LucideIcons.Lightbulb,
  rent: LucideIcons.Home,
  mortgage: LucideIcons.Home,
  home: LucideIcons.Home,
  
  // Shopping
  shopping: FaShoppingBag,
  clothing: LucideIcons.Shirt,
  clothes: LucideIcons.Shirt,
  electronics: LucideIcons.Smartphone,
  
  // Health & Wellness
  health: LucideIcons.Heart,
  fitness: LucideIcons.Dumbbell,
  medical: LucideIcons.Heart,
  
  // Entertainment
  entertainment: FaMusic || LucideIcons.Music,
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
 * Additional normalized mappings to handle different text formats
 * This helps with matching merchant names with different capitalizations and spaces
 */
const normalizedMerchantMap: Record<string, string> = {
  'netflix': 'netflix',
  'spotify': 'spotify',
  'amazon': 'amazon',
  'starbucks': 'starbucks',
  'uber': 'uber',
  'lyft': 'lyft',
  'zara': 'zara',
  'target': 'target',
  'walmart': 'walmart',
  'chipotle': 'chipotle',
  'mcdonalds': 'mcdonalds',
  'paypal': 'paypal',
  'venmo': 'venmo',
  'hulu': 'hulu',
  'disney': 'disney',
  'markcoleman': 'transfer',
  'damienlight': 'entertainment',
  'electricitybill': 'utilities',
  'healthinsurance': 'health',
  'payroll': 'transfer',
  'homedepot': 'home',
};

/**
 * Get the appropriate icon component based on name
 * Checks all icon maps in order of priority
 */
export const getIconByName = (name: string): React.FC<any> => {
  if (!name) return FaCreditCard;
  
  // Normalize name for matching
  const normalized = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  
  // Step 1: Check for direct match in merchant map
  if (merchantIconMap[name]) {
    return merchantIconMap[name];
  }
  
  // Step 2: Check for normalized merchant mapping
  if (normalizedMerchantMap[normalized]) {
    const mappedName = normalizedMerchantMap[normalized];
    
    if (merchantIconMap[mappedName]) {
      return merchantIconMap[mappedName];
    }
    
    if (categoryIconMap[mappedName]) {
      return categoryIconMap[mappedName];
    }
  }
  
  // Step 3: Check standard icon maps
  if (standardIconMap[name]) {
    return standardIconMap[name];
  }
  
  if (merchantIconMap[normalized]) {
    return merchantIconMap[normalized];
  }
  
  if (categoryIconMap[normalized]) {
    return categoryIconMap[normalized];
  }
  
  if (categoryIconMap[name]) {
    return categoryIconMap[name];
  }
  
  // Step 4: Default fallback icon
  return FaCreditCard;
};