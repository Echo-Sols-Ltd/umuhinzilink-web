import {
  PaymentMethod,
} from './order';

import {
  BuyerType,
  SupplierType,
  ExperienceLevel,
  Address,
  RwandaCrop,
  RwandaCropCategory,
  FarmSizeCategory,
} from './user';

import {
  ProductCategory,
  ProductType,
  CertificationType,
  MeasurementUnit,
} from './product';

import { User } from './user';

export interface OrderRequest {
  productId?: string; // Made optional for custom supplier orders
  quantity: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  // Additional fields for supplier orders
  productName?: string; // For custom supplier orders
  unitPrice?: number; // For custom supplier orders
}

export interface FarmerProductRequest {
  name: string;
  description: string;
  unitPrice: number;
  image: string;
  quantity: number;
  measurementUnit: MeasurementUnit;
  category: RwandaCropCategory;
  harvestDate: string;
  location: string;
  isNegotiable: boolean;
  certification: CertificationType;
}

export interface SupplierProductRequest {
  name: string;
  description: string;
  unitPrice: number;
  image: string;
  quantity: number;
  measurementUnit: MeasurementUnit;
  category: ProductCategory;
  harvestDate: Date;
  location: string;
  isNegotiable: boolean;
  certification: CertificationType;
}

export interface FarmerRequest {
  userId: string;
  farmSize: FarmSizeCategory;
  experienceLevel: ExperienceLevel;
  address: Address;
  crops: RwandaCrop[];
}

export interface BuyerRequest {
  userId: string;
  address: Address;
  buyerType: BuyerType;
}

export interface SupplierRequest {
  userId: string;
  businessName: string;
  address: Address;
  supplierType: SupplierType;
}
