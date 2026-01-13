export enum FarmerPages {
    DASHBOARD,
    PRODUCTS,
    INPUT_REQUEST,
    AI_TIPS,
    MARKET_ANALYTICS,
    MESSAGES,
    NOTIFICATIONS,
    PROFILE,
    ORDERS,
    SETTINGS,
    LOGOUT,
}

export enum AdminPages {
    DASHBOARD,
    USERS,
    ORDERS,
    REPORTS,
    PRODUCTS,
    PROFILE,
    SETTINGS,
}

export enum GovernmentPages {
    DASHBOARD,
    FARMERS_PRODUCE,
    SUPPLIERS_PRODUCE,
    NOTIFICATIONS,
    PROFILE,
    SETTINGS,
}

export enum SupplierPages {
    DASHBOARD,
    PRODUCTS,
    REQUESTS,
    ORDERS,
    MESSAGE,
    PROFILE,
    CONTACT,
    SETTINGS,
    LOGOUT,
}

export enum BuyerPages {
    DASHBOARD,
    PURCHASES,
    PRODUCT,
    SAVED,
    MESSAGE,
    PROFILE,
    CONTACT,
    SETTINGS,
    LOGOUT,
}


export enum UserType {
  FARMER = 'FARMER',
  BUYER = 'BUYER',
  SUPPLIER = 'SUPPLIER',
  ADMIN = 'ADMIN',
  GOVERNMENT = 'GOVERNMENT',
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

// District enum with display names and associated Province via mapping below
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

export enum SupplierType {
  WHOLESALER = 'WHOLESALER',
  RETAILER = 'RETAILER',
  AGGREGATOR = 'AGGREGATOR',
  COOPERATIVE = 'COOPERATIVE',
  PROCESSOR = 'PROCESSOR',
}

export enum BuyerType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
  INSTITUTION = 'INSTITUTION',
  NGO = 'NGO',
}

export enum Language {
  KINYARWANDA = 'KINYARWANDA',
  ENGLISH = 'ENGLISH',
  FRENCH = 'FRENCH',
}

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
  { label: 'AGGREGATOR', value: SupplierType.AGGREGATOR },
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

export const districtOptions = [
  { label: 'GASABO', value: District.GASABO },
  { label: 'KICUKIRO', value: District.KICUKIRO },
  { label: 'NYARUGENGE', value: District.NYARUGENGE },
  { label: 'BURERA', value: District.BURERA },
  { label: 'GAKENKE', value: District.GAKENKE },
  { label: 'GICUMBI', value: District.GICUMBI },
  { label: 'MUSANZE', value: District.MUSANZE },
  { label: 'RULINDO', value: District.RULINDO },
  { label: 'GISAGARA', value: District.GISAGARA },
  { label: 'HUYE', value: District.HUYE },
  { label: 'KAMONYI', value: District.KAMONYI },
  { label: 'MUHANGA', value: District.MUHANGA },
  { label: 'NYAMAGABE', value: District.NYAMAGABE },
  { label: 'NYANZA', value: District.NYANZA },
  { label: 'NYARUGURU', value: District.NYARUGURU },
  { label: 'RUHANGO', value: District.RUHANGO },
  { label: 'BUGESERA', value: District.BUGESERA },
  { label: 'GATSIBO', value: District.GATSIBO },
  { label: 'KAYONZA', value: District.KAYONZA },
  { label: 'KIREHE', value: District.KIREHE },
  { label: 'NGOMA', value: District.NGOMA },
  { label: 'NYAGATARE', value: District.NYAGATARE },
  { label: 'RWAMAGANA', value: District.RWAMAGANA },
  { label: 'KARONGI', value: District.KARONGI },
  { label: 'NGORORERO', value: District.NGORORERO },
  { label: 'NYABIHU', value: District.NYABIHU },
  { label: 'NYAMASHEKE', value: District.NYAMASHEKE },
  { label: 'RUBAVU', value: District.RUBAVU },
  { label: 'RUSIZI', value: District.RUSIZI },
  { label: 'RUTSIRO', value: District.RUTSIRO },
];

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ACTIVE = 'ACTIVE',
}

export enum PaymentMethod {
  MOBILE_MONEY = 'MOBILE_MONEY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}
export const provinceOptions = [
  { label: 'KIGALI_CITY', value: Province.KIGALI_CITY },
  { label: 'NORTHERN', value: Province.NORTHERN },
  { label: 'SOUTHERN', value: Province.SOUTHERN },
  { label: 'EASTERN', value: Province.EASTERN },
  { label: 'WESTERN', value: Province.WESTERN },
];

export const orderStatusOptions = [
  { label: 'PENDING', value: OrderStatus.PENDING },
  { label: 'COMPLETED', value: OrderStatus.COMPLETED },
  { label: 'CANCELLED', value: OrderStatus.CANCELLED },
  { label: 'ACTIVE', value: OrderStatus.ACTIVE },
];

export const paymentMethodOptions = [
  { label: 'MOBILE_MONEY', value: PaymentMethod.MOBILE_MONEY },
  { label: 'BANK_TRANSFER', value: PaymentMethod.BANK_TRANSFER },
  { label: 'CASH', value: PaymentMethod.CASH },
];

export const deliveryStatusOptions = [
  { label: 'PENDING', value: DeliveryStatus.PENDING },
  { label: 'SCHEDULED', value: DeliveryStatus.SCHEDULED },
  { label: 'IN_TRANSIT', value: DeliveryStatus.IN_TRANSIT },
  { label: 'DELIVERED', value: DeliveryStatus.DELIVERED },
  { label: 'FAILED', value: DeliveryStatus.FAILED },
];

// agriculture-products.ts

// High level product categories
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

// More granular product types (commonly used / available in Rwanda)
export enum ProductType {
  // Fertilizers (imported/used in Rwanda: NPK variants, DAP, UREA, CAN, TSP, blended)
  UREA = 'UREA',
  DAP = 'DAP',
  NPK_17_17_17 = 'NPK_17_17_17',
  NPK_BLEND = 'NPK_BLEND',
  CAN = 'CALCIUM_AMMONIUM_NITRATE',
  TSP = 'TSP',

  // Soil amendments & organic
  LIMESTONE = 'LIMESTONE',
  COMPOST = 'COMPOST',
  MANURE = 'MANURE',
  BIOFERTILIZER = 'BIOFERTILIZER',

  // Seeds & planting material
  HYBRID_SEEDS = 'HYBRID_SEEDS',
  OPEN_POLLINATED_SEEDS = 'OPEN_POLLINATED_SEEDS',
  VEGETABLE_SEEDS = 'VEGETABLE_SEEDS',
  POTATO_SEED_PIECES = 'POTATO_SEED_PIECES',
  COFFEE_SEEDLINGS = 'COFFEE_SEEDLINGS',

  // Pesticides / crop protection (broad class names; specific actives available/registered)
  HERBICIDE = 'HERBICIDE',
  INSECTICIDE = 'INSECTICIDE',
  FUNGICIDE = 'FUNGICIDE',
  ACARICIDE = 'ACARICIDE',
  RODENTICIDE = 'RODENTICIDE',
  BIOPESTICIDE = 'BIOPESTICIDE',

  // Tools (hand tools and manual implements)
  HOE = 'HOE',
  PANGA = 'PANGA',
  SPADE = 'SPADE',
  SHOVEL = 'SHOVEL',
  RAKE = 'RAKE',
  SICKLE = 'SICKLE',
  WHEELBARROW = 'WHEELBARROW',
  PRUNING_SHEARS = 'PRUNING_SHEARS',
  HAND_TROWEL = 'HAND_TROWEL',
  HAND_FORK = 'HAND_FORK',

  // Sprayers & application
  KNAPSACK_SPRAYER = 'KNAPSACK_SPRAYER',
  MOTORIZED_SPRAYER = 'MOTORIZED_SPRAYER',
  BACKPACK_SPRAYER = 'BACKPACK_SPRAYER',

  // Irrigation & water management
  DRIP_IRRIGATION_KIT = 'DRIP_IRRIGATION_KIT',
  SPRINKLER = 'SPRINKLER',
  IRRIGATION_PUMP = 'IRRIGATION_PUMP',
  WATER_TANK = 'WATER_TANK',
  LAYFLAT_HOSE = 'LAYFLAT_HOSE',
  HOSE_PIPE = 'HOSE_PIPE',

  // Small machinery & mechanization
  TRACTOR = 'TRACTOR',
  ROTAVATOR = 'ROTAVATOR',
  PLANTER = 'PLANTER',
  SEEDER = 'SEEDER',
  THRESHER = 'THRESHER',
  SHELLER = 'SHELLER',
  MINI_MILL = 'MINI_MILL',
  AGRI_TRICYCLE = 'AGRI_TRICYCLE',

  // Post-harvest & storage
  STORAGE_BAG = 'STORAGE_BAG',
  HERMETIC_BAG = 'HERMETIC_BAG',
  GRAIN_DRYER = 'GRAIN_DRYER',
  SCALE = 'SCALE',
  PACKAGING_MATERIAL = 'PACKAGING_MATERIAL',

  // Animal health & husbandry
  VACCINES = 'VACCINES',
  VETERINARY_MEDICINE = 'VETERINARY_MEDICINE',
  ACARICIDE_LIVESTOCK = 'ACARICIDE_LIVESTOCK',
  DEWORMER = 'DEWORMER',
  TEAT_DIP = 'TEAT_DIP',

  // Animal feed
  COMMERCIAL_FEED = 'COMMERCIAL_FEED',
  MINERAL_PREMIX = 'MINERAL_PREMIX',
  FORAGE_SEED = 'FORAGE_SEED',

  // Greenhouse & protection
  GREENHOUSE_NETTING = 'GREENHOUSE_NETTING',
  SHADE_NET = 'SHADE_NET',
  MULCH_FILM = 'MULCH_FILM',

  // Accessories & consumables
  PPE = 'PERSONAL_PROTECTIVE_EQUIPMENT',
  NOZZLES = 'SPRAY_NOZZLES',
  FILTERS = 'PUMP_FILTERS',
  SPARE_PARTS = 'SPARE_PARTS',
}

// Options arrays suitable for select controls (label/value)
export const productCategoryOptions = Object.values(ProductCategory).map(c => ({
  label: c
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, ch => ch.toUpperCase()),
  value: c,
}));

export const productTypeOptions = [
  // fertilizers / soil
  { label: 'UREA', value: ProductType.UREA },
  { label: 'DAP', value: ProductType.DAP },
  { label: 'NPK_17_17_17', value: ProductType.NPK_17_17_17 },
  { label: 'NPK_BLEND', value: ProductType.NPK_BLEND },
  { label: 'CALCIUM_AMMONIUM_NITRATE', value: ProductType.CAN },
  { label: 'TSP', value: ProductType.TSP },
  { label: 'COMPOST', value: ProductType.COMPOST },
  { label: 'LIMESTONE', value: ProductType.LIMESTONE },
  { label: 'BIOFERTILIZER', value: ProductType.BIOFERTILIZER },

  // seeds
  { label: 'HYBRID_SEEDS', value: ProductType.HYBRID_SEEDS },
  { label: 'OPEN_POLLINATED_SEEDS', value: ProductType.OPEN_POLLINATED_SEEDS },
  { label: 'VEGETABLE_SEEDS', value: ProductType.VEGETABLE_SEEDS },
  { label: 'POTATO_SEED_PIECES', value: ProductType.POTATO_SEED_PIECES },
  { label: 'COFFEE_SEEDLINGS', value: ProductType.COFFEE_SEEDLINGS },

  // pesticides / protection
  { label: 'HERBICIDE', value: ProductType.HERBICIDE },
  { label: 'INSECTICIDE', value: ProductType.INSECTICIDE },
  { label: 'FUNGICIDE', value: ProductType.FUNGICIDE },
  { label: 'ACARICIDE', value: ProductType.ACARICIDE },
  { label: 'RODENTICIDE', value: ProductType.RODENTICIDE },
  { label: 'BIOPESTICIDE', value: ProductType.BIOPESTICIDE },

  // tools & hand implements
  { label: 'HOE', value: ProductType.HOE },
  { label: 'PANGA', value: ProductType.PANGA },
  { label: 'SPADE', value: ProductType.SPADE },
  { label: 'SHOVEL', value: ProductType.SHOVEL },
  { label: 'WHEELBARROW', value: ProductType.WHEELBARROW },
  { label: 'PRUNING_SHEARS', value: ProductType.PRUNING_SHEARS },

  // sprayers & application
  { label: 'KNAPSACK_SPRAYER', value: ProductType.KNAPSACK_SPRAYER },
  { label: 'MOTORIZED_SPRAYER', value: ProductType.MOTORIZED_SPRAYER },

  // irrigation
  { label: 'DRIP_IRRIGATION_KIT', value: ProductType.DRIP_IRRIGATION_KIT },
  { label: 'SPRINKLER', value: ProductType.SPRINKLER },
  { label: 'IRRIGATION_PUMP', value: ProductType.IRRIGATION_PUMP },
  { label: 'WATER_TANK', value: ProductType.WATER_TANK },

  // small machinery
  { label: 'TRACTOR', value: ProductType.TRACTOR },
  { label: 'ROTAVATOR', value: ProductType.ROTAVATOR },
  { label: 'PLANTER', value: ProductType.PLANTER },
  { label: 'THRESHER', value: ProductType.THRESHER },
  { label: 'AGRI_TRICYCLE', value: ProductType.AGRI_TRICYCLE },

  // post-harvest
  { label: 'STORAGE_BAG', value: ProductType.STORAGE_BAG },
  { label: 'HERMETIC_BAG', value: ProductType.HERMETIC_BAG },
  { label: 'GRAIN_DRYER', value: ProductType.GRAIN_DRYER },
  { label: 'SCALE', value: ProductType.SCALE },

  // animal
  { label: 'VACCINES', value: ProductType.VACCINES },
  { label: 'VETERINARY_MEDICINE', value: ProductType.VETERINARY_MEDICINE },
  { label: 'COMMERCIAL_FEED', value: ProductType.COMMERCIAL_FEED },

  // greenhouse & accessories
  { label: 'GREENHOUSE_NETTING', value: ProductType.GREENHOUSE_NETTING },
  { label: 'SHADE_NET', value: ProductType.SHADE_NET },

  // accessories & PPE
  { label: 'PERSONAL_PROTECTIVE_EQUIPMENT', value: ProductType.PPE },
  { label: 'SPRAY_NOZZLES', value: ProductType.NOZZLES },
];

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

// Rwanda-specific crop list and categories with display-name values
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
