// API Configuration Constants

const PROD_SERVER = 'https://api.umuhinzi-backend.echo-solution.com';
const DEV_SERVER = 'http://localhost:6060'

export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' ? DEV_SERVER : PROD_SERVER,
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
    VERIFY_USER: '/auth/check-token',
    FORGOT_PASSWORD: '/auth/request-password-reset',
    RESET_PASSWORD: '/auth/reset-password',
    CHECK_OTP: '/auth/verify-otp',
    CHECK_RESET_CODE: '/auth/verify-reset-code',
    ASK_OTP_CODE: '/auth/ask-otp-code',
  },
  USER: {
    ALL: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    ME: '/users/me',
    UPLOAD_AVATAR: '/upload/user',
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
    SUPPLIER_ALL_PUBLIC: '/products/supplier/all',
    SUPPLIER_ALL: '/products/supplier',
    FARMER_ALL: '/products/farmer',
    FARMER_ALL_PUBLIC: '/products/farmer/all',
    SUPPLIER_SEARCH: '/products/supplier/search',
    FARMER_SEARCH: '/products/farmer/search',
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
  ADMIN: {
    USERS: '/admin/users',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    BUYERS: '/admin/buyers',
    FARMERS: '/admin/farmers',
    SUPPLIERS: '/admin/suppliers',
    USERS_BY_ID: (id: string) => `/admin/users/${id}`,
    PRODUCTS_BY_ID: (id: string) => `/admin/products/${id}`,
    ORDERS_BY_ID: (id: string) => `/admin/orders/${id}`,
    BUYERS_BY_ID: (id: string) => `/admin/buyers/${id}`,
    FARMERS_BY_ID: (id: string) => `/admin/farmers/${id}`,
    SUPPLIERS_BY_ID: (id: string) => `/admin/suppliers/${id}`,

  },
  GOVERNMENT: {
    USERS: '/government/users',
    USERS_BY_EMAIL: (email: string) => `/government/users/${email}`,
    USERS_SUPPLIERS: '/government/users/suppliers',
    USERS_FARMERS: '/government/users/farmers',
    USERS_BUYERS: '/government/users/buyers',
    PRODUCTS_SUPPLIERS: '/government/products/suppliers',
    PRODUCTS_FARMERS: '/government/products/farmers',
    ORDERS_SUPPLIERS: '/government/orders/suppliers',
    ORDERS_FARMERS: '/government/orders/farmers',
  },
  FILES: {
    UPLOAD_AVATAR: '/upload/user',
    UPLOAD_MESSAGE: '/upload/message',
    UPLOAD_GENERIC: '/upload',
  },
  WALLET: {
    BALANCE: '/wallet/balance',
    DEPOSIT: '/wallet/deposit',
    PAY_ORDER: '/wallet/pay-order',
    TRANSACTIONS: '/wallet/transactions',
    TRANSACTION_BY_ID: (id: string) => `/wallet/transaction/${id}`,
    ADMIN_CREATE_WALLET: (userId: string) => `/wallet/admin/create-wallet/${userId}`,
  },
  PAYMENT: {
    PROCESS: '/payments/process',
    STATUS: (transactionId: string) => `/payments/status/${transactionId}`,
    ORDER_PAYMENT: (orderId: string) => `/payments/order/${orderId}`,
    MY_TRANSACTIONS: '/payments/my-transactions',
    ADMIN_ALL_TRANSACTIONS: '/payments/admin/all-transactions',
  },
  MESSAGES: {
    CONVERSATION: (senderId: string, receiverId: string) => `/messages/all/${senderId}/${receiverId}`,
    BY_ID: (conversationId: string) => `/messages/${conversationId}`,
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



export const SOCKET_EVENTS = {
  MESSAGE: {
    SEND_MESSAGE: '/app/chat.sendMessage',
    REPLY_MESSAGE: '/app/chat.sendMessageReply',
    REACT_MESSAGE: '/app/chat.sendMessageReaction',
    EDIT_MESSAGE: '/app/chat.editMessage',
    DELETE_MESSAGE: '/app/chat.deleteMessage'
  }
};