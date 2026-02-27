// Component props and UI-related type definitions

import { UserType } from './enums';


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
  userType?: UserType;
}


