// Admin Dashboard Constants

export const ADMIN_API_ENDPOINTS = {
  USERS: '/api/v1/admin/users',
  PRODUCTS: '/api/v1/admin/products',
  ORDERS: '/api/v1/admin/orders',
} as const;

export const USER_ROLES = {
  FARMER: 'FARMER',
  BUYER: 'BUYER',
  SUPPLIER: 'SUPPLIER',
  ADMIN: 'ADMIN',
} as const;

export const PRODUCT_STATUS = {
  IN_STOCK: 'IN_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  LOW_STOCK: 'LOW_STOCK',
} as const;

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  ACTIVE: 'ACTIVE',
} as const;

export const PAYMENT_METHODS = {
  MOBILE_MONEY: 'MOBILE_MONEY',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CASH: 'CASH',
} as const;

export const DELIVERY_STATUS = {
  PENDING: 'PENDING',
  SCHEDULED: 'SCHEDULED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
} as const;

// Status color mappings
export const USER_ROLE_COLORS = {
  [USER_ROLES.FARMER]: 'bg-green-100 text-green-800',
  [USER_ROLES.BUYER]: 'bg-blue-100 text-blue-800',
  [USER_ROLES.SUPPLIER]: 'bg-purple-100 text-purple-800',
  [USER_ROLES.ADMIN]: 'bg-red-100 text-red-800',
} as const;

export const PRODUCT_STATUS_COLORS = {
  [PRODUCT_STATUS.IN_STOCK]: 'bg-green-100 text-green-800',
  [PRODUCT_STATUS.OUT_OF_STOCK]: 'bg-red-100 text-red-800',
  [PRODUCT_STATUS.LOW_STOCK]: 'bg-yellow-100 text-yellow-800',
} as const;

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ORDER_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
  [ORDER_STATUS.ACTIVE]: 'bg-blue-100 text-blue-800',
} as const;

export const DELIVERY_STATUS_COLORS = {
  [DELIVERY_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [DELIVERY_STATUS.SCHEDULED]: 'bg-blue-100 text-blue-800',
  [DELIVERY_STATUS.IN_TRANSIT]: 'bg-purple-100 text-purple-800',
  [DELIVERY_STATUS.DELIVERED]: 'bg-green-100 text-green-800',
  [DELIVERY_STATUS.FAILED]: 'bg-red-100 text-red-800',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 0;

// Table columns
export const ADMIN_TABLE_COLUMNS = {
  USERS: ['Role', 'Name', 'Email', 'Phone', 'Verified', 'Action'],
  PRODUCTS: ['Name', 'Category', 'Price', 'Quantity', 'Status', 'Action'],
  ORDERS: ['Order ID', 'Buyer', 'Product', 'Quantity', 'Total', 'Status', 'Action'],
} as const;

// Messages
export const ADMIN_MESSAGES = {
  DELETE_USER_SUCCESS: 'User deleted successfully',
  DELETE_PRODUCT_SUCCESS: 'Product deleted successfully',
  DELETE_ORDER_SUCCESS: 'Order deleted successfully',
  FETCH_ERROR: 'Failed to fetch data',
  DELETE_ERROR: 'Failed to delete item',
  LOADING: 'Loading...',
  NO_DATA: 'No data found',
} as const;
