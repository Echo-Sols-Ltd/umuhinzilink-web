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



export interface FormError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: FormError[];
  isSubmitting: boolean;
  isValid: boolean;
}