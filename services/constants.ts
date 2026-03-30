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
    REGISTER_FARMER: '/auth/register/farmer',
    REGISTER_SUPPLIER: '/auth/register/supplier',
    REGISTER_BUYER: '/auth/register/buyer',
    REGISTER_GOOGLE_USER: '/auth/register/google',
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
    ADMIN_STATS: '/dashboard/admin',
    GOVERNMENT_STATS: '/dashboard/government'
  },
  PRODUCT: {
    CREATE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    FARMER_STATS: '/products/farmer/stats',
    SUPPLIER_STATS: '/products/supplier/stats',
    PUBLIC_ALL: '/products/all',
    PRIVATE_ALL: '/products',
    SEARCH: '/products/search',
    // Legacy aliases
    CREATE_SUPPLIER: '/products',
    SUPPLIER_ALL: '/products',
    SUPPLIER_ALL_PUBLIC: '/products/all',
    SUPPLIER_SEARCH: '/products/search',
    BY_SUPPLIER_ID: (id: string) => `/products/${id}`,
    UPDATE_SUPPLIER: (id: string) => `/products/${id}`,
    DELETE_SUPPLIER: (id: string) => `/products/${id}`,
  },
  BUYER: {
    BY_ID: (id: string) => `/buyers/${id}`,
    ME: '/buyers/me',
    SAVE_PRODUCT: (id: string) => `/buyers/save-product/${id}`,
  },
  ORDER: {
    CREATE: '/orders',
    BY_ID: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/reject`,
    ACCEPT: (id: string) => `/orders/${id}/accept`,
    BUYER_ALL: '/orders/buyer',
    SELLER_ALL: '/orders/seller',
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    SATISFACTION: (id: string) => `/orders/${id}/satisfaction`,
    // Legacy aliases
    SUPPLIER_ALL: '/orders/seller',
    BY_SUPPLIER_ID: (id: string) => `/orders/${id}`,
    ACCEPT_SUPPLIER: (id: string) => `/orders/${id}/accept`,
    CANCEL_SUPPLIER: (id: string) => `/orders/${id}/reject`,
    UPDATE_SUPPLIER_STATUS: (id: string) => `/orders/${id}/status`,
  },
  NEGOTIATION: {
    BUYER: '/negotiations/buyer',
    SELLER: '/negotiations/seller', 
    BY_ID: (id: string) => `/negotiations/${id}`,
    MESSAGES: (id: string) => `/negotiations/${id}/messages`,
    SET_AGREED_PRICE: (id: string) => `/negotiations/${id}/set-price`,
  },
  ADMIN: {
    USERS: '/admin/users',
    FARMER_PRODUCTS: '/admin/farmer/products',
    SUPPLIER_PRODUCTS: '/admin/supplier/products',
    FARMER_ORDERS: '/admin/farmer/orders',
    SUPPLIER_ORDERS: '/admin/supplier/orders',
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
    // Admin endpoints
    ADMIN_ALL_WALLETS: '/admin/wallets',
    ADMIN_ALL_TRANSACTIONS: '/admin/transactions',
    SYSTEM_WALLET: '/admin/wallet/system',
    ADMIN_WALLET_BY_USER: (userId: string) => `/admin/wallets/user/${userId}`,
    ADMIN_TRANSACTIONS_BY_USER: (userId: string) => `/admin/transactions/user/${userId}`,
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
    MARK_READ: (conversionId: string) => `/messages/read/${conversionId}`
  },
  CHAT: {
    ALL: '/chat/users',
    BY_USER: (id: string) => `/chat/${id}`
  },
  CART: {
    ITEMS: {
      UPDATE: (itemId: string) => `/cart/items/${itemId}`,
      DELETE: (itemId: string) => `/cart/items/${itemId}`,
      ADD: '/cart/items',
      ADD_NEGOTIATE: '/cart/items/negotiate',
      READY_FOR_CHECKOUT: '/cart/items/ready-for-checkout',
      NORMAL: '/cart/items/normal',
      ACCEPTED_NEGOTIATIONS: '/cart/items/accepted-negotiations'
    },
    NEGOTIATE: '/cart/negotiate',
    CLEANUP_EXPIRED: '/cart/cleanup-expired',
    CHECKOUT: {
      NORMAL: '/cart/checkout/normal',
      NEGOTIATED: '/cart/checkout/negotiated',
      MIXED: '/cart/checkout/mixed'
    },
    GET: '/cart',
    CLEAR: '/cart'
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
  MESSAGE: {
    SEND_MESSAGE: '/app/chat.sendMessage',
    REPLY_MESSAGE: '/app/chat.sendMessageReply',
    REACT_MESSAGE: '/app/chat.sendMessageReaction',
    EDIT_MESSAGE: '/app/chat.editMessage',
    DELETE_MESSAGE: '/app/chat.deleteMessage',
    TYPING: '/app/chat.typing'
  },
  NEGOTIATION: {
    SUBSCRIBE_NEGOTIATION: '/topic/negotiation',
    SUBSCRIBE_MESSAGE: '/topic/negotiation/{negotiationId}',
    SUBSCRIBE_STATUS: '/queue/negotiationAccepted',
    SUBSCRIBE_REJECTED: '/queue/negotiationRejected'
  }
};