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
