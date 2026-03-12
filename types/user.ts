// User-related enums
export enum UserType {
  FARMER = 'FARMER',
  BUYER = 'BUYER',
  SUPPLIER = 'SUPPLIER',
  ADMIN = 'ADMIN',
  GOVERNMENT = 'GOVERNMENT',
}

export enum BuyerType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
  INSTITUTION = 'INSTITUTION',
  NGO = 'NGO',
}

export enum SupplierType {
  WHOLESALER = 'WHOLESALER',
  RETAILER = 'RETAILER',
  AGGREGATOR = 'AGGREGATOR',
  COOPERATIVE = 'COOPERATIVE',
  PROCESSOR = 'PROCESSOR',
}

export enum FarmSizeCategory {
  SMALLHOLDER = 'SMALLHOLDER',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  COOPERATIVE = 'COOPERATIVE',
}

export enum ExperienceLevel {
  LESS_THAN_1Y = 'LESS_THAN_1Y',
  Y1_TO_3 = 'Y1_TO_3',
  Y3_TO_5 = 'Y3_TO_5',
  Y5_TO_10 = 'Y5_TO_10',
  MORE_THAN_10 = 'MORE_THAN_10',
}

export enum Language {
  KINYARWANDA = 'KINYARWANDA',
  ENGLISH = 'ENGLISH',
  FRENCH = 'FRENCH',
}

export interface Address {
  province: Province;
  district: District;
}

export enum Province {
  KIGALI_CITY = 'KIGALI_CITY',
  NORTHERN = 'NORTHERN',
  SOUTHERN = 'SOUTHERN',
  EASTERN = 'EASTERN',
  WESTERN = 'WESTERN',
}

export enum District {
  // Kigali City
  GASABO = 'GASABO',
  KICUKIRO = 'KICUKIRO',
  NYARUGENGE = 'NYARUGENGE',

  // Northern Province
  BURERA = 'BURERA',
  GAKENKE = 'GAKENKE',
  GICUMBI = 'GICUMBI',
  MUSANZE = 'MUSANZE',
  RULINDO = 'RULINDO',

  // Southern Province
  GISAGARA = 'GISAGARA',
  HUYE = 'HUYE',
  KAMONYI = 'KAMONYI',
  MUHANGA = 'MUHANGA',
  NYAMAGABE = 'NYAMAGABE',
  NYANZA = 'NYANZA',
  NYARUGURU = 'NYARUGURU',
  RUHANGO = 'RUHANGO',

  // Eastern Province
  BUGESERA = 'BUGESERA',
  GATSIBO = 'GATSIBO',
  KAYONZA = 'KAYONZA',
  KIREHE = 'KIREHE',
  NGOMA = 'NGOMA',
  NYAGATARE = 'NYAGATARE',
  RWAMAGANA = 'RWAMAGANA',

  // Western Province
  KARONGI = 'KARONGI',
  NGORORERO = 'NGORORERO',
  NYABIHU = 'NYABIHU',
  NYAMASHEKE = 'NYAMASHEKE',
  RUBAVU = 'RUBAVU',
  RUSIZI = 'RUSIZI',
  RUTSIRO = 'RUTSIRO',
}

// Mapping of District -> Province to mirror the Java enum relationship
export const DISTRICT_PROVINCE_MAP: Record<District, Province> = {
  // Kigali City
  [District.GASABO]: Province.KIGALI_CITY,
  [District.KICUKIRO]: Province.KIGALI_CITY,
  [District.NYARUGENGE]: Province.KIGALI_CITY,

  // Northern Province
  [District.BURERA]: Province.NORTHERN,
  [District.GAKENKE]: Province.NORTHERN,
  [District.GICUMBI]: Province.NORTHERN,
  [District.MUSANZE]: Province.NORTHERN,
  [District.RULINDO]: Province.NORTHERN,

  // Southern Province
  [District.GISAGARA]: Province.SOUTHERN,
  [District.HUYE]: Province.SOUTHERN,
  [District.KAMONYI]: Province.SOUTHERN,
  [District.MUHANGA]: Province.SOUTHERN,
  [District.NYAMAGABE]: Province.SOUTHERN,
  [District.NYANZA]: Province.SOUTHERN,
  [District.NYARUGURU]: Province.SOUTHERN,
  [District.RUHANGO]: Province.SOUTHERN,

  // Eastern Province
  [District.BUGESERA]: Province.EASTERN,
  [District.GATSIBO]: Province.EASTERN,
  [District.KAYONZA]: Province.EASTERN,
  [District.KIREHE]: Province.EASTERN,
  [District.NGOMA]: Province.EASTERN,
  [District.NYAGATARE]: Province.EASTERN,
  [District.RWAMAGANA]: Province.EASTERN,

  // Western Province
  [District.KARONGI]: Province.WESTERN,
  [District.NGORORERO]: Province.WESTERN,
  [District.NYABIHU]: Province.WESTERN,
  [District.NYAMASHEKE]: Province.WESTERN,
  [District.RUBAVU]: Province.WESTERN,
  [District.RUSIZI]: Province.WESTERN,
  [District.RUTSIRO]: Province.WESTERN,
};

export enum RwandaCrop {
  // Cereals
  MAIZE = 'MAIZE',
  RICE = 'RICE',
  WHEAT = 'WHEAT',
  SORGHUM = 'SORGHUM',
  FINGER_MILLET = 'FINGER_MILLET',

  // Legumes & Pulses
  DRY_BEANS = 'DRY_BEANS',
  SOYBEAN = 'SOYBEAN',
  FIELD_PEA = 'FIELD_PEA',
  COWPEA = 'COWPEA',
  GROUNDNUT = 'GROUNDNUT',
  PIGEON_PEA = 'PIGEON_PEA',

  // Roots & Tubers
  CASSAVA = 'CASSAVA',
  IRISH_POTATO = 'IRISH_POTATO',
  SWEET_POTATO = 'SWEET_POTATO',
  TARO = 'TARO',
  YAM = 'YAM',

  // Bananas & Plantains
  COOKING_BANANA = 'COOKING_BANANA',
  PLANTAIN = 'PLANTAIN',
  DESSERT_BANANA = 'DESSERT_BANANA',

  // Vegetables (horticulture)
  TOMATO = 'TOMATO',
  ONION = 'ONION',
  CABBAGE = 'CABBAGE',
  CARROT = 'CARROT',
  EGGPLANT = 'EGGPLANT',
  GREEN_PEPPER = 'GREEN_PEPPER',
  CHILI_PEPPER = 'CHILI_PEPPER',
  CUCUMBER = 'CUCUMBER',
  LETTUCE = 'LETTUCE',
  SPINACH = 'SPINACH',
  AMARANTH_GREENS = 'AMARANTH_GREENS',
  OKRA = 'OKRA',
  FRENCH_BEAN = 'FRENCH_BEAN',
  GARLIC = 'GARLIC',
  GINGER = 'GINGER',

  // Fruits
  PINEAPPLE = 'PINEAPPLE',
  AVOCADO = 'AVOCADO',
  MANGO = 'MANGO',
  PAPAYA = 'PAPAYA',
  PASSION_FRUIT = 'PASSION_FRUIT',
  ORANGE = 'ORANGE',
  LEMON = 'LEMON',
  LIME = 'LIME',
  TANGERINE = 'TANGERINE',
  WATERMELON = 'WATERMELON',
  TREE_TOMATO = 'TREE_TOMATO',
  STRAWBERRY = 'STRAWBERRY',

  // Cash crops
  COFFEE = 'COFFEE',
  TEA = 'TEA',
  PYRETHRUM = 'PYRETHRUM',
  COTTON = 'COTTON',
  SUGARCANE = 'SUGARCANE',

  // Oilseeds
  SUNFLOWER = 'SUNFLOWER',
  SESAME = 'SESAME',
  RAPESEED = 'RAPESEED',

  // Spices & Herbs
  TURMERIC = 'TURMERIC',
  CORIANDER = 'CORIANDER',
  BASIL = 'BASIL',
  ROSEMARY = 'ROSEMARY',
  THYME = 'THYME',

  // Fodder & Forage
  NAPIER_GRASS = 'NAPIER_GRASS',
  LUCERNE = 'LUCERNE',

  // Other
  BAMBOO_SHOOTS = 'BAMBOO_SHOOTS',
  MUSHROOM = 'MUSHROOM',
  VANILLA = 'VANILLA',
  ALOE_VERA = 'ALOE_VERA',
  HONEY = 'HONEY',
}

export enum RwandaCropCategory {
  CEREALS = 'CEREALS',
  LEGUMES_PULSES = 'LEGUMES_PULSES',
  ROOTS_TUBERS = 'ROOTS_TUBERS',
  VEGETABLES = 'VEGETABLES',
  FRUITS = 'FRUITS',
  CASH_CROPS = 'CASH_CROPS',
  SPICES_HERBS = 'SPICES_HERBS',
  OILSEEDS = 'OILSEEDS',
  FODDER_FORAGE = 'FODDER_FORAGE',
  OTHER = 'OTHER',
}

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
