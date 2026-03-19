// Product-related enums
export enum ProductType {
  FARMER_PRODUCT = 'FARMER_PRODUCT',
  SUPPLIER_PRODUCT = 'SUPPLIER_PRODUCT'
}

export enum ProductCategory {

  // ── FARMER CATEGORIES ────────────────────────────────────────
  CEREALS = "Cereals",
  LEGUMES_PULSES = "Legumes & Pulses",
  ROOTS_TUBERS = "Roots & Tubers",
  BANANAS_PLANTAINS = "Bananas & Plantains",
  VEGETABLES = "Vegetables",
  FRUITS = "Fruits",
  CASH_CROPS = "Cash Crops",
  OILSEEDS = "Oilseeds",
  SPICES_HERBS = "Spices & Herbs",
  FODDER_FORAGE = "Fodder & Forage",

  // ── SUPPLIER CATEGORIES ──────────────────────────────────────
  FERTILISER = "Fertiliser",
  PESTICIDE = "Pesticide",
  HERBICIDE = "Herbicide",
  FUNGICIDE = "Fungicide",
  SEEDS_SEEDLINGS = "Seeds & Seedlings",
  IRRIGATION = "Irrigation Equipment",
  HAND_TOOLS = "Hand Tools",
  MACHINERY = "Machinery",
  STORAGE_EQUIPMENT = "Storage Equipment",
  PACKAGING = "Packaging Material",
  ANIMAL_FEED = "Animal Feed",
  VETERINARY = "Veterinary Products",

  // ── SHARED ───────────────────────────────────────────────────
  OTHER = "Other"
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
  DRAFT = "DRAFT",
  IN_STOCK = "IN_STOCK",
  LOW_STOCK = "LOW_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  DISCONTINUED = "DISCONTINUED"
}

export enum MeasurementUnit {
  KG = "Kilogram",
  G = "Gram",
  TON = "Metric Ton",
  LITER = "Liter",
  ML = "Milliliter",
  BAG_25KG = "25kg Bag",
  BAG_50KG = "50kg Bag",
  BAG_100KG = "100kg Bag",
  CRATE = "Crate",
  BUNDLE = "Bundle",
  BUNCH = "Bunch",
  PIECE = "Piece",
  DOZEN = "Dozen",
  JERRICAN = "Jerrican",
  SACK = "Sack"
}

export enum CertificationType {
  NONE = 'NONE',
  RSB = 'RSB',
  RWANDA_GAP = 'RWANDA_GAP',
  NAEB = 'NAEB',
  COOPERATIVE_CERT = 'COOPERATIVE_CERT',
  OTHER = 'OTHER',
}

import { District, User } from './user';

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
  category: ProductCategory;
  description: string;
  unitPrice: number;
  measurementUnit: MeasurementUnit;
  image: string;
  location: string;
  district: District;
  stockQuantity: number;
  isNegotiable: boolean;
  productType: ProductType;
  certification: CertificationType;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  category: ProductCategory;
  description: string;
  unitPrice: number;
  measurementUnit: string;
  image: string;
  quantity: number;
  isNegotiable: boolean;
  certification: CertificationType;
}
