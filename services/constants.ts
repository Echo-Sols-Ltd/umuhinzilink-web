// API Configuration Constants

const SERVER_URL = 'https://api.umuhinzi-backend.echo-solution.com';
// const SERVER_URL = 'http://localhost:801'

export const API_CONFIG = {
  BASE_URL: SERVER_URL,
  API_VERSION: 'v1',
  TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REGISTER_FARMER: '/auth/register/farmer',
    REGISTER_SUPPLIER: '/auth/register/supplier',
    REGISTER_BUYER: '/auth/register/buyer',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_USER: '/auth/check-user',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHECK_OTP: '/auth/verify-otp',
    CHECK_RESET_CODE: '/auth/check-reset-code',
    ASK_OTP_CODE: '/auth/ask-otp-code',
  },
  USER: {
    ALL: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    ME: '/users/me',
    UPLOAD_AVATAR: '/',
  },
  FARMER: {
    BY_ID: (id: string) => `/farmers/${id}`,
    ME: '/farmers/me',
  },
  SUPPLIER: {
    BY_ID: (id: string) => `/suppliers/${id}`,
    ME: '/suppliers/me',
  },
  DASHBOARD: {
    FARMER_STATS: '/dashboard/farmer',
    SUPPLIER_STATS: '/dashboard/supplier',
    BUYER_STATS: '/dashboard/buyer',
  },
  PRODUCT: {
    CREATE_FARMER: '/products/farmer',
    CREATE_SUPPLIER: '/products/supplier',
    BY_SUPPLIER_ID: (id: string) => `/products/supplier/${id}`,
    BY_FARMER_ID: (id: string) => `/products/farmer/${id}`,
    UPDATE_SUPPLIER: (id: string) => `/products/supplier/${id}`,
    UPDATE_FARMER: (id: string) => `/products/farmer/${id}`,
    DELETE_SUPPLIER: (id: string) => `/products/supplier/${id}`,
    DELETE_FARMER: (id: string) => `/products/farmer/${id}`,
    FARMER_STATS: '/products/farmer/stats',
    SUPPLIER_STATS: '/products/supplier/stats',
    FARMER_BUYER_ALL: '/products/supplier/all',
    SUPPLIER_ALL: '/products/supplier',
    FARMER_ALL: '/products/farmer',
    BUYER_ALL: '/products/farmer/all',
  },
  BUYER: {
    BY_ID: (id: string) => `/buyers/${id}`,
    ME: '/buyers/me',
    SAVE_PRODUCT: (id: string) => `/buyers/save-product/${id}`,
  },
  ORDER: {
    CREATE_SUPPLIER: '/orders/supplier',
    CREATE_FARMER: '/orders/farmer',
    BY_FARMER_ID: (id: string) => `/orders/farmer/${id}`,
    BY_SUPPLIER_ID: (id: string) => `/orders/supplier/${id}`,
    CANCEL_SUPPLIER: (id: string) => `/orders/supplier/${id}/reject`,
    CANCEL_FARMER: (id: string) => `/orders/farmer/${id}/reject`,
    ACCEPT_SUPPLIER: (id: string) => `/orders/supplier/${id}/accept`,
    ACCEPT_FARMER: (id: string) => `/orders/farmer/${id}/accept`,
    BUYER_ALL: '/orders/buyer',
    FARMER_BUYER_ALL: '/orders/farmer',
    SUPPLIER_ALL: '/orders/supplier/all',
    FARMER_ALL: '/orders/farmer/all',
    UPDATE_FARMER_STATUS: (id: string) => `/orders/farmer/${id}/status`,
    UPDATE_SUPPLIER_STATUS: (id: string) => `/orders/supplier/${id}/status`,
  },
  FILES: {
    UPLOAD_AVATAR: '/upload/user',
    UPLOAD_MESSAGE: '/upload/message',
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
