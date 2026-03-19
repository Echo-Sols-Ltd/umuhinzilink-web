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


export interface FarmerRequest {
  farmSize: FarmSizeCategory;
  experienceLevel: ExperienceLevel;
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
