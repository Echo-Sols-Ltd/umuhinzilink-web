import {
  Month,
  ProductCategory,
  ProductType,
  ProductStatus,
  MeasurementUnit,
  CertificationType,
  RwandaCrop,
  RwandaCropCategory,
} from './enums';
import { Farmer, Supplier } from './user';

export interface Statistics {
  month: Month;
  quantity: number;
  money: number;
}

export interface Trend {
  rising: boolean;
  percentage: number;
}

export interface FarmerProductionStat {
  product: FarmerProduct;
  kigali: number;
  musanze: number;
  nyagatare: number;
  statistics: Statistics[];
  trend: Trend;
}

export interface SupplierProductionStat {
  product: SupplierProduct;
  kigali: number;
  musanze: number;
  nyagatare: number;
  statistics: Statistics[];
  trend: Trend;
}

export interface FarmerProduct {
  id: string;
  farmer: Farmer;
  name: RwandaCrop;
  description: string;
  unitPrice: number;
  image: string;
  quantity: number;
  measurementUnit: MeasurementUnit;
  category: RwandaCropCategory;
  harvestDate: Date;
  location: string;
  isNegotiable: boolean;
  certification: CertificationType;
  productStatus: ProductStatus;
}

export interface SupplierProduct {
  id: string;
  supplier: Supplier;
  name: ProductType;
  description: string;
  unitPrice: number;
  images: string[];
  quantity: number;
  measurementUnit: MeasurementUnit;
  category: ProductCategory;
  harvestDate: Date;
  location: string;
  isNegotiable: boolean;
  certification: CertificationType;
  productStatus: ProductStatus;
}

export const cropOptions = Object.values(RwandaCrop).map(crop => ({
  label: crop.toString(),
  value: crop,
}));
