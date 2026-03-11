import {
  Month,
  ProductType,
  ProductStatus,
  MeasurementUnit,
  CertificationType,
} from './enums';
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
