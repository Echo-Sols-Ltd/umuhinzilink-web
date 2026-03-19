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
  LESS_THAN_1Y = "Less than 1 year",
  Y1_TO_3 = "1 to 3 years",
  Y3_TO_5 = "3 to 5 years",
  Y5_TO_10 = "5 to 10 years",
  MORE_THAN_10 = "More than 10 years"
}

export enum Language {
  KINYARWANDA = 'KINYARWANDA',
  ENGLISH = 'ENGLISH',
  FRENCH = 'FRENCH',
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


export interface User {
  avatar: string;
  createdAt: string;
  id: string;
  lastLogin: string;
  updatedAt: string;
  isVerified: boolean;
  firstName: string;
  lastName: string;
  isGoogleUser: boolean;
  language: Language;
  email: string;
  district: District;
  province: Province;
  phoneNumber: string;
  password: string;
  role: UserType;
}

export interface Farmer {
  id: string
  user: User
  farmSize: FarmSizeCategory
  experienceLevel: ExperienceLevel
}

export interface Buyer {
  id: string;
  user: User;
  buyerType: BuyerType;
  savedProducts: string[];
}

export interface Supplier {
  id: string;
  user: User;
  businessName: string;
  supplierType: SupplierType;
  businessRegistrationNumber: string;
}

export interface UserRequest {
  firstName: string;
  lastName: string
  email: string;
  phoneNumber: string;
  password: string;
  role: UserType;
  district: District;
}
