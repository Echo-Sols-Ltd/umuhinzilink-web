// Product-related enums
export enum ProductType {
  FARMER_PRODUCT = 'FARMER_PRODUCT',
  SUPPLIER_PRODUCT = 'SUPPLIER_PRODUCT'
}

export enum ProductCategory {
  FERTILIZER = 'FERTILIZER',
  SEEDS = 'SEEDS',
  PESTICIDE = 'PESTICIDE',
  TOOLS = 'TOOLS',
  IRRIGATION = 'IRRIGATION',
  MACHINERY = 'MACHINERY',
  POST_HARVEST = 'POST_HARVEST',
  ANIMAL_HEALTH = 'ANIMAL_HEALTH',
  ANIMAL_FEED = 'ANIMAL_FEED',
  SOIL_AMENDMENT = 'SOIL_AMENDMENT',
  ORGANIC_INPUT = 'ORGANIC_INPUT',
  PACKAGING = 'PACKAGING',
  GREENHOUSE = 'GREENHOUSE',
  ACCESSORIES = 'ACCESSORIES',
}

export enum Month {
  JANUARY,
  FEBRUARY,
  MARCH,
  APRIL,
  MAY,
  JUNE,
  JULY,
  AUGUST,
  SEPTEMBER,
  OCTOBER,
  NOVEMBER,
  DECEMBER,
}

export enum ProductStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  LOW_STOCK = 'LOW_STOCK',
}

export enum MeasurementUnit {
  KG = 'KG',
  G = 'G',
  TON = 'TON',
  LITER = 'LITER',
  ML = 'ML',
  BAG = 'BAG',
  CRATE = 'CRATE',
  BUNDLE = 'BUNDLE',
  PIECE = 'PIECE',
}

export enum CertificationType {
  NONE = 'NONE',
  RSB = 'RSB',
  RWANDA_GAP = 'RWANDA_GAP',
  NAEB = 'NAEB',
  COOPERATIVE_CERT = 'COOPERATIVE_CERT',
  OTHER = 'OTHER',
}

import { User } from './user';

export interface Statistics {
  month: Month;
  quantity: number;
  money: number;
}

export interface Trend {
  rising: boolean;
  percentage: number;
}

export interface Product {
  id: string;
  owner: User;
  name: string;
  description: string;
  unitPrice: number;
  image: string;
  quantity: number;
  measurementUnit: MeasurementUnit;
  category: string;
  location: string;
  isNegotiable: boolean;
  certification: CertificationType;
  productStatus: ProductStatus;
  productType: ProductType;
  createdAt: string;
  updatedAt: string;
}

export interface FarmerProductRequest {
  name: string;
  category: string;
  description: string;
  unitPrice: number;
  measurementUnit: string;
  image: string;
  quantity: number;
  location: string;
  isNegotiable: boolean;
  certification: CertificationType;
}

export interface SupplierProductRequest {
  name: string;
  category: string;
  description: string;
  unitPrice: number;
  measurementUnit: string;
  image: string;
  quantity: number;
  location: string;
  isNegotiable: boolean;
  certification: CertificationType;
}
