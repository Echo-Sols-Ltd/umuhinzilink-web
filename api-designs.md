# UmuhinziLink API Documentation

## Overview

**Base URL**: `http://localhost:6060/api/v1`  
**API Version**: 1.0.1  
**Authentication**: JWT Bearer Token  
**Documentation**: OpenAPI 3.0 (Swagger UI available at `/swagger-ui.html`)  

### Response Format
All endpoints return a standardized response wrapper:
```json
{
  "success": boolean,
  "data": T,
  "message": string
}
```

### Authentication
- Include JWT token in Authorization header: `Authorization: Bearer <token>`
- Public endpoints: `/api/v1/auth/**`, `/api/v1/public/**`, `/api/v1/ws/**`
- All other endpoints require authentication

---

## Authentication & User Management

### AuthController (`/api/v1/auth`)

#### POST `/register`
Register a generic user account.

**Request Body** (`UserRegistrationDTO`):
```json
{
  "names": "string (2-50 chars, required)",
  "email": "string (valid email, required)",
  "phoneNumber": "string (valid phone, required)",
  "password": "string (min 4 chars, required)",
  "role": "BUYER | FARMER | SUPPLIER | ADMIN"
}
```

**Response** (`LoginResponseDTO`):
```json
{
  "success": true,
  "data": {
    "token": "string",
    "user": {
      "id": "string",
      "names": "string",
      "email": "string",
      "role": "string",
      "verified": boolean
    }
  },
  "message": "Registration successful"
}
```

#### POST `/register/farmer`
Register as a farmer with additional farming details.

**Request Body** (`FarmerRegistration`):
```json
{
  "userId": "string",
  "farmSize": "SMALLHOLDER | MEDIUM | LARGE | COOPERATIVE",
  "crops": ["MAIZE", "RICE", "BEANS", ...],
  "experienceLevel": "LESS_THAN_1Y | Y1_TO_3 | Y3_TO_5 | Y5_TO_10 | MORE_THAN_10",
  "address": {
    "district": "string",
    "province": "string"
  }
}
```

**Response** (`FarmerDTO`):
```json
{
  "success": true,
  "data": {
    "id": "string",
    "user": {
      "id": "string",
      "names": "string",
      "email": "string",
      "phoneNumber": "string",
      "role": "FARMER",
      "address": {
        "district": "string",
        "province": "string"
      }
    },
    "farmSize": "string",
    "crops": ["string"],
    "experienceLevel": "string"
  },
  "message": "Farmer registration successful"
}
```

#### POST `/register/buyer`
Register as a buyer.

**Request Body** (`BuyerRegistration`):
```json
{
  "userId": "string",
  "address": {
    "district": "string",
    "province": "string"
  },
  "buyerType": "INDIVIDUAL | BUSINESS | INSTITUTION | NGO"
}
```

#### POST `/register/supplier`
Register as a supplier.

**Request Body** (`SupplierRegistration`):
```json
{
  "userId": "string",
  "businessName": "string",
  "supplierType": "WHOLESALER | RETAILER | AGGREGATOR | COOPERATIVE | PROCESSOR",
  "address": {
    "district": "string",
    "province": "string"
  }
}
```

#### POST `/login`
Login with email and password.

**Request Body** (`LoginDTO`):
```json
{
  "email": "string",
  "password": "string"
}
```

**Response** (`LoginResponseDTO`):
```json
{
  "success": true,
  "data": {
    "token": "string",
    "user": {
      "id": "string",
      "names": "string",
      "email": "string",
      "role": "string",
      "verified": boolean
    }
  },
  "message": "Login successful"
}
```

#### POST `/login/google`
Login with Google OAuth.

**Request Body** (`GoogleAuthRequest`):
```json
{
  "idToken": "string"
}
```

#### POST `/request-password-reset`
Request password reset code.

**Request Body** (`ForgotPasswordRequest`):
```json
{
  "email": "string"
}
```

#### POST `/verify-reset-code`
Verify password reset code.

**Request Body** (`VerifyCodeRequestDTO`):
```json
{
  "email": "string",
  "code": "string"
}
```

#### POST `/reset-password`
Reset password with verification code.

**Request Body** (`ResetPasswordRequest`):
```json
{
  "email": "string",
  "code": "string",
  "newPassword": "string"
}
```

#### POST `/logout` 🔒
Logout current user.

**Headers**: `Authorization: Bearer <token>`

#### GET `/check-token` 🔒
Validate JWT token.

**Response**:
```json
{
  "success": true,
  "data": {
    "valid": true,
    "user": {
      "id": "string",
      "email": "string",
      "role": "string"
    }
  }
}
```

#### GET `/ask-otp-code` 🔒
Request OTP code via email.

#### POST `/verify-otp` 🔒
Verify OTP code.

**Request Body**: `"123456"`

---

## User Profiles

### BuyerController (`/api/v1/buyers`)

#### GET `/me` 🔒
Get authenticated buyer profile.

**Response** (`BuyerDTO`):
```json
{
  "success": true,
  "data": {
    "id": "string",
    "user": {
      "id": "string",
      "names": "string",
      "email": "string",
      "phoneNumber": "string",
      "address": {
        "district": "string",
        "province": "string"
      }
    },
    "buyerType": "INDIVIDUAL | BUSINESS | INSTITUTION | NGO",
    "savedProducts": ["productId1", "productId2"]
  }
}
```

#### POST `/save-product/{productId}` 🔒
Save product to wishlist.

**Path Parameters**: `productId` (string)

### FarmerController (`/api/v1/farmers`)

#### GET `/me` 🔒
Get authenticated farmer profile.

### SupplierController (`/api/v1/suppliers`)

#### GET `/me` 🔒
Get authenticated supplier profile.

---

## Product Management

### ProductController (`/api/v1/products`)

#### POST `/farmer` 🔒
Create a farmer product.

**Request Body** (`FarmerProductRequest`):
```json
{
  "name": "MAIZE | RICE | BEANS | ...",
  "category": "CEREALS | LEGUMES | VEGETABLES | ...",
  "description": "string",
  "unitPrice": 1000,
  "measurementUnit": "KG | G | TON | LITER | BAG | CRATE | BUNDLE | PIECE",
  "image": "string (URL)",
  "quantity": 100,
  "harvestDate": "2024-01-15T10:30:00",
  "location": "string",
  "isNegotiable": true,
  "certification": "NONE | RSB | RWANDA_GAP | NAEB | COOPERATIVE_CERT | OTHER"
}
```

**Response** (`FarmerProductDTO`):
```json
{
  "success": true,
  "data": {
    "id": "string",
    "farmer": {
      "id": "string",
      "user": {
        "names": "string",
        "email": "string"
      }
    },
    "name": "MAIZE",
    "category": "CEREALS",
    "description": "string",
    "unitPrice": 1000,
    "measurementUnit": "KG",
    "image": "string",
    "quantity": 100,
    "harvestDate": "2024-01-15T10:30:00",
    "location": "string",
    "isNegotiable": true,
    "certification": "RSB",
    "productStatus": "IN_STOCK | OUT_OF_STOCK | LOW_STOCK"
  }
}
```

#### POST `/supplier` 🔒
Create a supplier product.

**Request Body** (`SupplierProductRequest`):
```json
{
  "name": "UREA | DAP | SEEDS | HOE | ...",
  "category": "FERTILIZER | SEEDS | TOOLS | MACHINERY | ...",
  "description": "string",
  "unitPrice": 5000,
  "measurementUnit": "KG | BAG | PIECE | ...",
  "image": "string (URL)",
  "quantity": 50,
  "harvestDate": "2024-01-15T10:30:00",
  "location": "string",
  "isNegotiable": false,
  "certification": "RSB | NONE | ..."
}
```

#### GET `/farmer/{id}`
Get farmer product by ID.

**Path Parameters**: `id` (string)

#### GET `/supplier/{id}`
Get supplier product by ID.

#### GET `/farmer/all`
Get all farmer products (paginated).

**Query Parameters**:
- `page` (int, default: 0)
- `size` (int, default: 10)
- `sortBy` (string, default: "createdAt")
- `sortDirection` (string, default: "desc")

**Response**:
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "string",
        "farmer": {...},
        "name": "MAIZE",
        "unitPrice": 1000,
        ...
      }
    ],
    "totalElements": 100,
    "totalPages": 10,
    "size": 10,
    "number": 0
  }
}
```

#### GET `/supplier/all`
Get all supplier products (paginated).

#### GET `/farmer` 🔒
Get authenticated farmer's products.

#### GET `/supplier` 🔒
Get authenticated supplier's products.

#### GET `/farmer/search`
Search farmer products.

**Query Parameters**:
- `name` (string, optional)
- `keyword` (string, optional)
- `category` (string, optional)
- `minPrice` (double, optional)
- `maxPrice` (double, optional)
- `status` (string, optional)
- `page` (int, default: 0)
- `size` (int, default: 10)

#### GET `/supplier/search`
Search supplier products.

#### PUT `/farmer/{id}` 🔒
Update farmer product.

#### PUT `/supplier/{id}` 🔒
Update supplier product.

#### DELETE `/farmer/{id}` 🔒
Delete farmer product.

#### DELETE `/supplier/{id}` 🔒
Delete supplier product.

#### GET `/farmer/stats` 🔒
Get farmer product statistics.

#### GET `/supplier/stats` 🔒
Get supplier product statistics.

---

## Order Management

### OrderController (`/api/v1/orders`)

#### POST `/farmer` 🔒
Create order for farmer product.

**Request Body** (`OrderRequest`):
```json
{
  "productId": "string",
  "quantity": 10,
  "totalPrice": 10000.0,
  "paymentMethod": "MOBILE_MONEY | BANK_TRANSFER | CASH"
}
```

**Response** (`FarmerOrderDTO`):
```json
{
  "success": true,
  "data": {
    "id": "string",
    "buyer": {
      "id": "string",
      "names": "string",
      "email": "string"
    },
    "product": {
      "id": "string",
      "name": "MAIZE",
      "unitPrice": 1000
    },
    "quantity": 10,
    "totalPrice": 10000.0,
    "isPaid": false,
    "status": "PENDING | PAID | PROCESSING | COMPLETED | CANCELLED",
    "paymentMethod": "MOBILE_MONEY",
    "deliveryDate": "2024-01-20T10:00:00",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
}
```

#### POST `/supplier` 🔒
Create order for supplier product.

#### GET `/buyer` 🔒
Get buyer's orders.

#### GET `/farmer` 🔒
Get farmer's buyer orders.

#### GET `/farmer/all` 🔒
Get all farmer's orders.

#### GET `/supplier/all` 🔒
Get all supplier's orders.

#### GET `/farmer/{id}`
Get farmer order by ID.

#### GET `/supplier/{id}`
Get supplier order by ID.

#### PUT `/farmer/{id}/accept` 🔒
Accept farmer order.

#### PUT `/supplier/{id}/accept` 🔒
Accept supplier order.

#### PUT `/farmer/{id}/reject` 🔒
Reject farmer order.

#### PUT `/supplier/{id}/reject` 🔒
Reject supplier order.

#### PUT `/farmer/{id}/status` 🔒
Update farmer order delivery status.

**Request Body**: `"PENDING | SCHEDULED | IN_TRANSIT | DELIVERED"`

#### PUT `/supplier/{id}/status` 🔒
Update supplier order delivery status.

---

## Payment System

### PaymentController (`/api/v1/payments`)

#### POST `/process` 🔒
Process payment for order.

**Request Body** (`PaymentRequest`):
```json
{
  "orderId": "string",
  "paymentMethod": "MOBILE_MONEY | BANK_TRANSFER | CASH",
  "phoneNumber": "string (for mobile money)",
  "accountNumber": "string (for bank transfer)",
  "bankName": "string (for bank transfer)",
  "notes": "string (optional)"
}
```

**Response** (`PaymentResponseDTO`):
```json
{
  "success": true,
  "data": {
    "transactionId": "string",
    "orderId": "string",
    "amount": 10000.00,
    "paymentMethod": "MOBILE_MONEY",
    "status": "PENDING | PROCESSING | COMPLETED | FAILED | CANCELLED",
    "reference": "string",
    "message": "Payment initiated successfully",
    "createdAt": "2024-01-15T10:30:00",
    "paidAt": null,
    "phoneNumber": "string"
  }
}
```

#### GET `/status/{transactionId}` 🔒
Check payment status.

#### GET `/order/{orderId}` 🔒
Get payment details for order.

#### GET `/my-transactions` 🔒
Get user's transaction history (paginated).

**Query Parameters**:
- `page` (int, default: 0)
- `size` (int, default: 10)
- `sortBy` (string, default: "createdAt")
- `sortDir` (string, default: "desc")

#### GET `/admin/all-transactions` 🔒 (Admin only)
Get all transactions.

---

## Wallet System

### WalletController (`/api/v1/wallet`)

#### GET `/balance` 🔒
Get wallet balance.

**Response** (`WalletDTO`):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "userEmail": "string",
    "userName": "string",
    "balance": 50000.00,
    "currency": "RWF",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
}
```

#### POST `/deposit` 🔒
Deposit money to wallet.

**Request Body** (`WalletDepositRequest`):
```json
{
  "amount": 10000.00,
  "description": "string (optional)"
}
```

**Response** (`WalletTransactionDTO`):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "walletId": "uuid",
    "amount": 10000.00,
    "type": "DEPOSIT",
    "status": "COMPLETED",
    "description": "Wallet deposit",
    "createdAt": "2024-01-15T10:30:00"
  }
}
```

#### POST `/pay-order` 🔒
Pay for order using wallet.

**Request Body** (`WalletPaymentRequest`):
```json
{
  "orderId": "string",
  "description": "string (optional)"
}
```

#### GET `/transactions` 🔒
Get transaction history (paginated).

#### GET `/transaction/{transactionId}` 🔒
Get transaction details.

#### POST `/admin/create-wallet/{userId}` 🔒 (Admin only)
Create wallet for user.

---

## Dashboard & Analytics

### DashboardController (`/api/v1/dashboard`)

#### GET `/buyer` 🔒
Get buyer dashboard metrics.

**Response** (`BuyerDashboard`):
```json
{
  "success": true,
  "data": {
    "totalOrders": 25,
    "pendingOrders": 5,
    "completedOrders": 20,
    "totalSpent": 250000.00,
    "savedProducts": 15,
    "recentOrders": [...],
    "monthlySpending": [...]
  }
}
```

#### GET `/farmer` 🔒
Get farmer dashboard metrics.

**Response** (`FarmerDashboard`):
```json
{
  "success": true,
  "data": {
    "totalProducts": 12,
    "activeProducts": 8,
    "totalOrders": 45,
    "pendingOrders": 3,
    "totalRevenue": 450000.00,
    "monthlyRevenue": [...],
    "topProducts": [...]
  }
}
```

#### GET `/supplier` 🔒
Get supplier dashboard metrics.

---

## Administration

### AdminController (`/api/v1/admin`)

#### GET `/users` 🔒
Get all users.

#### GET `/orders` 🔒
Get all orders.

#### GET `/products` 🔒
Get all products.

#### GET `/create-test-users` 🔒 (Testing only)
Create bulk test users.

**Query Parameters**: `count` (int)

### GovernmentController (`/api/v1/government`)

#### GET `/orders/farmers` 🔒
Get all farmer orders.

#### GET `/orders/suppliers` 🔒
Get all supplier orders.

#### GET `/products/farmers` 🔒
Get all farmer products.

#### GET `/products/suppliers` 🔒
Get all supplier products.

#### GET `/users` 🔒
Get all users.

#### GET `/users/{email}` 🔒
Get user by email.

#### GET `/users/buyers` 🔒
Get all buyers.

#### GET `/users/farmers` 🔒
Get all farmers.

#### GET `/users/suppliers` 🔒
Get all suppliers.

---

## Messaging System

### MessageController (`/api/v1/messages`)

#### GET `/all/{senderId}/{receiverId}` 🔒
Get conversation messages between two users.

#### GET `/{conversationId}` 🔒
Get message by ID.

### ChatController (WebSocket - `/api/v1/ws`)

**Connection**: Connect to `/api/v1/ws`

#### Send Message
**Destination**: `/chat.sendMessage`
**Payload** (`ChatMessage`):
```json
{
  "senderId": "string",
  "receiverId": "string",
  "content": "string",
  "messageType": "TEXT | IMAGE | FILE"
}
```

**Response Topic**: `/topic/messages`

#### Reply to Message
**Destination**: `/chat.sendMessageReply`
**Payload** (`ChatMessageReply`):
```json
{
  "messageId": "string",
  "senderId": "string",
  "receiverId": "string",
  "content": "string"
}
```

#### Edit Message
**Destination**: `/chat.editMessage`
**Payload** (`ChatMessageEdit`):
```json
{
  "messageId": "string",
  "newContent": "string"
}
```

**Response Topic**: `/topic/messageEdition`

---

## File Management

### UploaderController (`/api/v1/upload`)

#### POST `/user` 🔒
Upload user profile image.

**Request**: `multipart/form-data` with file
**Response**: `"http://localhost:6060/api/v1/public/profile/filename.png"`

#### POST `/message`
Upload message file.

#### POST `/`
Upload generic file.

### MediaController (`/api/v1/public`)

#### GET `/profile/{fileName}`
Get profile image.

**Response**: Image file (PNG)

#### GET `/message/{fileName}`
Get message file.

---

## Data Types & Enums

### User Roles
```
BUYER, FARMER, SUPPLIER, ADMIN
```

### Buyer Types
```
INDIVIDUAL, BUSINESS, INSTITUTION, NGO
```

### Supplier Types
```
WHOLESALER, RETAILER, AGGREGATOR, COOPERATIVE, PROCESSOR
```

### Payment Methods
```
MOBILE_MONEY, BANK_TRANSFER, CASH
```

### Order Status
```
PENDING, PENDING_PAYMENT, PAID, PROCESSING, COMPLETED, CANCELLED, ACTIVE
```

### Product Status
```
IN_STOCK, OUT_OF_STOCK, LOW_STOCK
```

### Delivery Status
```
PENDING, SCHEDULED, IN_TRANSIT, DELIVERED
```

### Measurement Units
```
KG (Kilogram), G (Gram), TON (Metric Ton), LITER, ML (Milliliter), 
BAG, CRATE, BUNDLE, PIECE
```

### Experience Levels
```
LESS_THAN_1Y, Y1_TO_3, Y3_TO_5, Y5_TO_10, MORE_THAN_10
```

### Farm Size Categories
```
SMALLHOLDER, MEDIUM, LARGE, COOPERATIVE
```

### Certification Types
```
NONE, RSB, RWANDA_GAP, NAEB, COOPERATIVE_CERT, OTHER
```

### Rwanda Crops (Sample)
```
MAIZE, RICE, WHEAT, SORGHUM, DRY_BEANS, SOYBEAN, CASSAVA, 
IRISH_POTATO, SWEET_POTATO, COOKING_BANANA, TOMATO, ONION, 
CABBAGE, COFFEE, TEA, AVOCADO, MANGO, PINEAPPLE, ...
```

### Product Categories (Supplier)
```
FERTILIZER, SEEDS, PESTICIDE, TOOLS, IRRIGATION, MACHINERY, 
POST_HARVEST, ANIMAL_HEALTH, ANIMAL_FEED, SOIL_AMENDMENT, 
ORGANIC_INPUT, PACKAGING, GREENHOUSE, ACCESSORIES
```

### Product Types (Supplier - Sample)
```
UREA, DAP, NPK_17_17_17, HYBRID_SEEDS, HERBICIDE, INSECTICIDE, 
HOE, PANGA, SPADE, KNAPSACK_SPRAYER, TRACTOR, ROTAVATOR, ...
```

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "data": null,
  "message": "Error description"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

### Validation Errors
```json
{
  "success": false,
  "data": {
    "field": "email",
    "message": "Email should be valid"
  },
  "message": "Validation failed"
}
```

---

## Rate Limiting & Security

- **CORS**: Enabled for specific origins
- **CSRF**: Disabled (stateless JWT)
- **Session**: Stateless
- **Password**: BCrypt encrypted
- **File Upload**: Max 5MB per file
- **JWT**: Include in Authorization header

---

## Development Notes

- **Database**: PostgreSQL with Hibernate/JPA
- **WebSocket**: Real-time messaging support
- **Swagger**: Available at `/swagger-ui.html`
- **Health Check**: `/actuator/health`
- **Environment**: Development server on port 6060

🔒 = Requires Authentication