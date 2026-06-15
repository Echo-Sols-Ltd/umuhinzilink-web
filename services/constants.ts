// API Configuration Constants

const PROD_SERVER = 'https://api.umuhinzilink.echo-solution.com';
const DEV_SERVER = 'http://localhost:7022'

export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'development' ? DEV_SERVER : PROD_SERVER,
  API_VERSION: 'v1',
  TIMEOUT: 20000,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    GOOGLE_LOGIN: '/auth/login/google',
    REGISTER: '/auth/register',
    REGISTER_SELLER: '/auth/register/seller',
    REGISTER_GOOGLE_USER: '/auth/register/google',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_USER: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    CHECK_RESET_CODE: '/auth/check-reset-code',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_OTP: '/auth/verify-otp',
    ASK_OTP_CODE: '/auth/ask-otp-code',
  },
  USER: {
    ALL: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    ME: '/users/me',
    UPLOAD_AVATAR: '/upload/user',

  },
  SELLER: {
    BY_ID: (id: string) => `/sellers/${id}`,
    ME: '/sellers/me',
  },
  DASHBOARD: {
    SELLER_STATS: '/dashboard/seller',
    BUYER_STATS: '/dashboard/buyer',
    ADMIN_STATS: '/dashboard/admin',
  },
  PRODUCT: {
    CREATE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    SELLER_STATS: '/products/seller/stats',
    ALL: '/products/all',
    SELLER: '/products/seller',
    SEARCH: '/products/search',
  },
  ORDER: {
    CREATE: '/orders',
    ALL: '/orders',
    BY_ID: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    SELLER_ALL: '/orders/seller',
  },
  NEGOTIATION: {
    ALL: '/negotiations',
    BY_ID: (id: string) => `/negotiations/${id}`,
    MESSAGES: (id: string) => `/negotiations/${id}/messages`,
    BUYER: '/negotiations/buyer',
    SELLER: '/negotiations/seller',
    SET_AGREED_PRICE: (id: string) => `/negotiations/${id}/set-agreed-price`,
    SET_BUYER_PRICE: (id: string) => `/negotiations/${id}/set-buyer-price`,
    BUYER_ACCEPT: (id: string) => `/negotiations/${id}/accept`,
    SELLER_ACCEPT: (id: string) => `/negotiations/${id}/seller-accept`,
    BUYER_REJECT: (id: string) => `/negotiations/${id}/reject`,
  },
  ADMIN: {
    USERS: '/admin/users',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    BUYERS: '/admin/buyers',
    SELLERS: '/admin/sellers',
    USERS_BY_ID: (id: string) => `/admin/users/${id}`,
    PRODUCTS_BY_ID: (id: string) => `/admin/products/${id}`,
    ORDERS_BY_ID: (id: string) => `/admin/orders/${id}`,
    BUYERS_BY_ID: (id: string) => `/admin/buyers/${id}`,
    SELLERS_BY_ID: (id: string) => `/admin/sellers/${id}`,
  },
  FILES: {
    UPLOAD_AVATAR: '/upload/user',
    UPLOAD_MESSAGE: '/upload/message',
    UPLOAD_GENERIC: '/upload',
  },
  WALLET: {
    ME: '/wallet/me',
    DEPOSIT: '/wallet/deposit',
    TRANSACTIONS: '/wallet/transactions',
    TRANSACTION_BY_ID: (id: string) => `/wallet/transactions/${id}`,
    ADMIN_ALL_WALLETS: '/admin/wallets',
    ADMIN_ALL_TRANSACTIONS: '/admin/transactions',
    SYSTEM_WALLET: '/admin/wallet/system',
    ADMIN_WALLET_BY_USER: (userId: string) => `/admin/wallets/${userId}`,
    ADMIN_TRANSACTIONS_BY_USER: (userId: string) => `/admin/transactions/${userId}`,
  },
  PAYMENT: {
    PAY: '/payments/pay',
    PROCESS: '/payments/process',
    STATUS: (transactionId: string) => `/payments/status/${transactionId}`,
    ORDER_PAYMENT: (orderId: string) => `/payments/order/${orderId}`,
  },
  MESSAGES: {
    CONVERSATION: (senderId: string, receiverId: string) => `/messages/all/${senderId}/${receiverId}`,
    BY_ID: (conversationId: string) => `/messages/${conversationId}`,
    MARK_READ: (conversionId: string) => `/messages/read/${conversionId}`
  },
  CHAT: {
    ALL: '/chat/users',
    BY_USER: (id: string) => `/chat/${id}`
  }
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
  NEGOTIATION_MESSAGE: {
    SUBSCRIBE: (id: string) => `/topic/negotiation/${id}`,
    SEND: (id: string) => `/app/negotiation/${id}`,
  }
};