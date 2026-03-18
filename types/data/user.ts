import { UserType, BuyerType, SupplierType, FarmSizeCategory, ExperienceLevel, Language } from '../user';

// User type options for UI components
export const userTypeOptions = [
  { label: 'BUYER', value: UserType.BUYER },
  { label: 'FARMER', value: UserType.FARMER },
  { label: 'SUPPLIER', value: UserType.SUPPLIER },
];

export const buyerTypeOptions = [
  { label: 'BUSINESS', value: BuyerType.BUSINESS },
  { label: 'INDIVIDUAL', value: BuyerType.INDIVIDUAL },
  { label: 'INSTITUTION', value: BuyerType.INSTITUTION },
  { label: 'NGO', value: BuyerType.NGO },
];

export const supplierTypeOptions = [
  { label: 'WHOLESALER', value: SupplierType.WHOLESALER },
  { label: 'RETAILER', value: SupplierType.RETAILER },
  { label: 'COOPERATIVE', value: SupplierType.COOPERATIVE },
  { label: 'PROCESSOR', value: SupplierType.PROCESSOR },
];

export const farmSizeOptions = [
  { label: 'SMALLHOLDER', value: FarmSizeCategory.SMALLHOLDER },
  { label: 'MEDIUM', value: FarmSizeCategory.MEDIUM },
  { label: 'LARGE', value: FarmSizeCategory.LARGE },
  { label: 'COOPERATIVE', value: FarmSizeCategory.COOPERATIVE },
];

export const experienceLevelOptions = [
  { label: 'LESS_THAN_1Y', value: ExperienceLevel.LESS_THAN_1Y },
  { label: 'Y1_TO_3', value: ExperienceLevel.Y1_TO_3 },
  { label: 'Y3_TO_5', value: ExperienceLevel.Y3_TO_5 },
  { label: 'Y5_TO_10', value: ExperienceLevel.Y5_TO_10 },
  { label: 'MORE_THAN_10', value: ExperienceLevel.MORE_THAN_10 },
];

export const languageOptions = [
  { label: 'KINYARWANDA', value: Language.KINYARWANDA },
  { label: 'ENGLISH', value: Language.ENGLISH },
  { label: 'FRENCH', value: Language.FRENCH },
];
