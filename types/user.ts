import {
  Address,
  BuyerType,
  ExperienceLevel,
  FarmSizeCategory,
  Language,
  RwandaCrop,
  SupplierType,
  UserType,
} from './enums';

export interface User {
  avatar: string;
  createdAt: string;
  id: string;
  lastLogin: string;
  updatedAt: string;
  verified: boolean;
  names: string;
  email: string;
  address: Address;
  phoneNumber: string;
  password: string;
  role: UserType;
  language: Language;
  supervisor?: string;
  jurisdiction?: string;
  department?: string;
  employeeId?: string;
  position?: string;
  securityClearance?: string;
  officeLocation?: string;
}

export interface Farmer {
  id: string;
  user: User;
  crops: RwandaCrop[];
  farmSize: FarmSizeCategory;
  experienceLevel: ExperienceLevel;
  names?: string;
  address?: Address | null;
  trainingCompleted?: string[];
  lastInspectionDate?: string;
  inspectionStatus?: string;
  isOrganicCertified?: boolean;
  primaryMarkets?: string[];
  paymentMethods?: string[];
  deliveryRadius?: number;
  yearsInBusiness?: number;
  certifications?: string[];
  farmName?: string;
  farmRegistrationNumber?: string;
  soilType?: string;
  waterSource?: string;
  annualProduction?: number;
  harvestSeasons?: string[];
  storageCapacity?: number;
}

export interface Buyer {
  id: string;
  user: User;
  buyerType: BuyerType;
  savedProducts: string[];
  budgetRange?: string;
  preferredPaymentMethod?: string;
  deliveryFrequency?: string;
  creditLimit?: number;
  billingCycle?: string;
  taxExempt?: boolean;
  totalOrders?: number;
  totalSpent?: number;
  averageOrderValue?: number;
  lastOrderDate?: string;
  deliveryAddress?: string;
  deliverySchedule?: string;
  preferredSuppliers?: string[];
  specialRequirements?: string;
  paymentMethods?: string[];
  businessName?: string;
  businessRegistrationNumber?: string;
  yearsInBusiness?: number;
  preferredCategories?: string[];
  orderFrequency?: string;
  qualityRequirements?: string;
}

export interface Supplier {
  id: string;
  user: User;
  businessName: string;
  supplierType: SupplierType;
  certifications?: string[];
  qualityStandards?: string;
  insuranceCoverage?: string;
  complianceStatus?: string;
  paymentTerms?: string;
  warehouseLocation?: string;
  storageCapacity?: number;
  fleetSize?: number;
  deliveryRadius?: number;
  businessLicenseNumber?: string;
  productCategories?: string[];
  serviceAreas?: string[];
  deliveryOptions?: string[];
  businessRegistrationNumber?: string;
  yearsInBusiness?: number;
  numberOfEmployees?: number;
  annualRevenue?: number;
  taxId?: string;
}

export interface UserRequest {
  names: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserType;
}
