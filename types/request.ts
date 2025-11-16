import { PaymentMethod, FarmSizeCategory, ExperienceLevel, SupplierType, BuyerType, Address,CertificationType, MeasurementUnit, RwandaCrop, RwandaCropCategory, ProductCategory, ProductType  } from "./enums";

export interface OrderRequest {
    productId:string;
    quantity: number;
    totalPrice: number;
    paymentMethod: PaymentMethod;
}


export interface FarmerProductRequest {
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
}

export interface SupplierProductRequest {
    name: ProductType;
    description: string;
    unitPrice: number;
    image: string;
    quantity: number;
    measurementUnit: MeasurementUnit;
    category: ProductCategory;
    harvestDate: Date;
    location: string;
    isNegotiable: boolean;
    certification: CertificationType;
}

export interface FarmerRequest {
    userId: string
    farmSize: FarmSizeCategory;
    experienceLevel: ExperienceLevel;
    address: Address
    crops: RwandaCrop[];
}

export interface BuyerRequest {
    userId: string
    address: Address
    buyerType: BuyerType;
}

export interface SupplierRequest {
    userId: string
    businessName: string;
    address: Address
    supplierType: SupplierType;
}

