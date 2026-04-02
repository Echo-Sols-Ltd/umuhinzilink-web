import {
  BuyerType,
  SupplierType,
  ExperienceLevel,
  FarmSizeCategory,
} from './user';


export interface FarmerRequest {
  farmSize: FarmSizeCategory;
  experienceLevel: ExperienceLevel;
}

export interface BuyerRequest {
  userId: string;
  buyerType: BuyerType;
}

export interface SupplierRequest {
  businessName: string;
  supplierType: SupplierType;
}
