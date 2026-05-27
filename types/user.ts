// User-related enums
export enum UserRole {
  SELLER = 'SELLER',
  BUYER = 'BUYER',
  ADMIN = 'ADMIN',
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

export interface OtpCode {
  token: string;
  expiresAt: string;

}


export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePicture: string;
  language: Language;
  role: UserRole;
  savedProducts: string[];
  active: boolean;
  emailVerified: boolean;
  otpCode: OtpCode;
  googleId: string;
  createdAt: string;
  updatedAt: string;
}


export interface Seller {
  id: string;
  user: User;
  displayName: string;
  location: string;
  description: string;
  phone: string;
}

export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
}

export interface SellerRegistration {
  businessName: string;
  location: string;
  description: string;
  phoneNumber: string;
}
