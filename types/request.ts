import {
  PaymentMethod,
} from './order';

import {
  BuyerType,
  SupplierType,
  ExperienceLevel,
  FarmSizeCategory,
  District,
} from './user';


import { User } from './user';

export interface FarmerRequest {
  userId: string;
  farmSize: FarmSizeCategory;
  experienceLevel: ExperienceLevel;
  district: District
}

export interface BuyerRequest {
  userId: string;
  district: District;
  buyerType: BuyerType;
}

export interface SupplierRequest {
  userId: string;
  businessName: string;
  district: District;
  supplierType: SupplierType;
}
