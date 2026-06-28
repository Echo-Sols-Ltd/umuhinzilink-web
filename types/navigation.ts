// Navigation-related enums
export enum FarmerPages {
  DASHBOARD,
  PRODUCTS,
  INPUT_REQUEST,
  AI_TIPS,
  MARKET_ANALYTICS,
  MESSAGES,
  NOTIFICATIONS,
  PROFILE,
  ORDERS,
  WALLET,
  SETTINGS,
  LOGOUT,
}

export enum AdminPages {
  DASHBOARD,
  USERS,
  ORDERS,
  REPORTS,
  PRODUCTS,
  PROFILE,
  SETTINGS,
  MESSAGES,
}

export enum GovernmentPages {
  DASHBOARD,
  FARMERS_PRODUCE,
  SUPPLIERS_PRODUCE,
  NOTIFICATIONS,
  PROFILE,
  SETTINGS,
  MESSAGES,
}

export enum SupplierPages {
  DASHBOARD,
  PRODUCTS,
  REQUESTS,
  ORDERS,
  MESSAGE,
  PROFILE,
  CONTACT,
  SETTINGS,
  LOGOUT,
}

export enum BuyerPages {
  DASHBOARD,
  PURCHASES,
  PRODUCT,
  SAVED,
  WALLET,
  MESSAGE,
  PROFILE,
  CONTACT,
  SETTINGS,
  LOGOUT,
}

// Component props and UI-related type definitions

import { UserRole } from './user';

export interface SidebarItem {
  icon: any;
  label: string;
  href: string;
  active?: boolean;
  hasDropdown?: boolean;
  badge?: string;
}

export interface SidebarProps {
  activeItem?: string;
  userType?: UserRole;
  hideTopbar?: boolean;
}
