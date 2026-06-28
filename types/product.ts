import { District, User } from './user';

export enum ProductCategory {

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


export interface Product {
  id: string;
  owner: User;
  name: string;
  description: string;
  category: ProductCategory;
  unitPrice: number;
  stockQuantity: number;
  measurementUnit: MeasurementUnit;
  district: District;
  isNegotiable: boolean;
  image: string;
  status: ProductStatus;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  category: ProductCategory;
  unitPrice: number;
  stockQuantity: number;
  measurementUnit: MeasurementUnit;
  district: District;
  image: string;
  isNegotiable: boolean;
}
