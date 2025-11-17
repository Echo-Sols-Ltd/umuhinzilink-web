import {
  Address,
  BuyerType,
  ExperienceLevel,
  FarmSizeCategory,
  Language,
  RwandaCrop,
  SupplierType,
  UserType,
} from './enums';

export interface User {
  avatar: string;
  createdAt: string;
  id: string;
  lastLogin: string;
  updatedAt: string;
  verified: boolean;
  names: string;
  email: string;
  address: Address;
  phoneNumber: string;
  password: string;
  role: UserType;
  language: Language;
}

export interface Farmer {
  id: string;
  user: User;
  crops: RwandaCrop[];
  farmSize: FarmSizeCategory;
  experienceLevel: ExperienceLevel;
}

export interface Buyer {
  id: string;
  user: User;
  buyerType: BuyerType;
  savedProducts: string[];
}

export interface Supplier {
  id: string;
  user: User;
  businessName: string;
  supplierType: SupplierType;
}

export interface UserRequest {
  names: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserType;
}
