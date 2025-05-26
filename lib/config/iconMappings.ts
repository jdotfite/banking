/**
 * Icon Mappings Configuration
 * 
 * This file contains all icon mappings used throughout the application.
 * Centralizing these mappings makes it easier to maintain and update icons.
 */

import * as LucideIcons from 'lucide-react';

// Import brand icons from react-icons/si (Simple Icons)
// Simple Icons has the most comprehensive collection of brand icons
import { 
  SiNetflix,
  SiAmazon, 
  SiWalmart, 
  SiTarget,
  SiStarbucks,
  SiZara,
  SiUber,
  SiLyft,
  SiSpotify,
  SiMcdonalds,
  SiPaypal,
  SiVenmo,
  SiEbay
} from 'react-icons/si';

// Import general icons from react-icons/fa6 (Font Awesome 6)
import {
  FaCreditCard,
  FaCartShopping,
  FaBagShopping,
  FaMugSaucer,
  FaUtensils,
  FaCar,
  FaDollarSign,
  FaMusic,
  FaTv
} from 'react-icons/fa6';

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
  shield: LucideIcons.Shield,
  fileText: LucideIcons.FileText,
  
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
 * Using primarily Simple Icons (SI) for brands which has the most comprehensive collection
 */
export const merchantIconMap: Record<string, any> = {
  // Streaming services
  netflix: SiNetflix,
  hulu: FaTv,
  disney: FaTv,
  
  // Music services
  spotify: SiSpotify,
  appleMusic: FaMusic,
  
  // Shopping
  amazon: SiAmazon,
  target: SiTarget,
  walmart: SiWalmart,
  zara: SiZara,
  ebay: SiEbay,
  
  // Transportation
  uber: SiUber,
  lyft: SiLyft,
  
  // Food & Drink
  starbucks: SiStarbucks,
  mcdonalds: SiMcdonalds,
  chipotle: FaUtensils,
  
  // Financial
  payroll: LucideIcons.Landmark,
  venmo: SiVenmo,
  paypal: SiPaypal,
};

/**
 * Category-specific icons for transaction categorization
 */
export const categoryIconMap: Record<string, any> = {
  // Food & Dining
  food: FaUtensils,
  dining: FaUtensils,
  groceries: FaCartShopping,
  coffee: FaMugSaucer,
  
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
  shopping: FaBagShopping,
  clothing: LucideIcons.Shirt,
  clothes: LucideIcons.Shirt,
  electronics: LucideIcons.Smartphone,
  
  // Health & Wellness
  health: LucideIcons.Heart,
  fitness: LucideIcons.Dumbbell,
  medical: LucideIcons.Heart,
  
  // Entertainment
  entertainment: FaMusic,
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
 * Check if a name belongs to a known merchant with a brand icon
 * @param name The merchant name to check
 * @returns Boolean indicating if this is a known merchant with a brand icon
 */
export const isBrandMerchant = (name: string): boolean => {
  if (!name) return false;
  
  const normalized = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  
  // Direct match
  if (merchantIconMap[name]) return true;
  
  // Normalized match
  if (merchantIconMap[normalized]) return true;
  
  // Mapped match
  if (normalizedMerchantMap[normalized] && merchantIconMap[normalizedMerchantMap[normalized]]) {
    return true;
  }
  
  return false;
};

/**
 * Get the appropriate icon component based on merchant and category
 * Uses an intelligent algorithm to prioritize brand icons
 */
export const getTransactionIcon = (merchant: string, icon?: string, category?: string): React.ComponentType<any> => {
  // First, try to get a brand icon for the merchant
  if (merchant && isBrandMerchant(merchant)) {
    const brandIcon = getIconByName(merchant);
    if (brandIcon) return brandIcon;
  }
  
  // If no brand icon found, try the icon field (category icon)
  if (icon) {
    const categoryIcon = getIconByName(icon);
    if (categoryIcon) return categoryIcon;
  }
  
  // If that fails, try the category field
  if (category) {
    const categoryIconFromField = getIconByName(category);
    if (categoryIconFromField) return categoryIconFromField;
  }
  
  // Last resort - credit card fallback
  return FaCreditCard;
};

/**
 * Get the appropriate icon component based on name
 * Checks all icon maps in order of priority
 */
export const getIconByName = (name: string): React.ComponentType<any> => {
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
