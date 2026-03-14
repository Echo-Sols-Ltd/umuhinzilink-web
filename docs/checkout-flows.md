# Umuhinzilink Checkout Flows & Order Negotiations

## Overview

This document outlines the complete checkout and order negotiation system for the Umuhinzilink platform, including all available flows, endpoints, and business logic.

## Cart Management System

### Cart Item Types
- **NORMAL**: Standard purchase items ready for immediate checkout
- **NEGOTIATION**: Items requiring price negotiation before purchase  
- **NEGOTIATION_ACCEPTED**: Negotiated items with agreed pricing, ready for checkout

### Cart Endpoints

#### Get User's Cart
```
GET /api/v1/cart
```
- Retrieves the authenticated user's shopping cart with all items
- Returns cart with items grouped by type and readiness status

#### Add Items to Cart
```
POST /api/v1/cart/items
```
- Add a product to cart for normal purchase
- Body: `AddToCartRequest`

#### Add Item for Negotiation
```
POST /api/v1/cart/items/negotiate
```
- Add a product to cart with price negotiation request
- Automatically sets item type to `NEGOTIATION`
- Body: `AddToCartRequest`

#### Update Cart Item
```
PUT /api/v1/cart/items/{itemId}
```
- Update the quantity of an item in the cart
- Body: `UpdateCartItemRequest`

#### Remove Cart Item
```
DELETE /api/v1/cart/items/{itemId}
```
- Remove a specific item from the cart

#### Clear Cart
```
DELETE /api/v1/cart
```
- Remove all items from the cart

#### Cart Query Endpoints
```
GET /api/v1/cart/items/ready-for-checkout
GET /api/v1/cart/items/normal
GET /api/v1/cart/items/accepted-negotiations
POST /api/v1/cart/cleanup-expired
```

## Checkout Flows

### 1. Normal Items Checkout
```
POST /api/v1/cart/checkout/normal
```
- **Purpose**: Process all `NORMAL` type cart items
- **Process**:
  - Validates cart has normal items
  - Creates orders with original product prices
  - Removes checked-out items from cart
  - Creates new cart if all items processed
- **Response**: List of created `OrderDTO`

### 2. Accepted Negotiations Checkout
```
POST /api/v1/cart/checkout/negotiated
```
- **Purpose**: Process all `NEGOTIATION_ACCEPTED` items
- **Process**:
  - Validates cart has accepted negotiation items
  - Creates orders with negotiated prices
  - Removes checked-out items from cart
- **Response**: List of created `OrderDTO`

### 3. Mixed Checkout
```
POST /api/v1/cart/checkout/mixed
```
- **Purpose**: Process both normal items and accepted negotiations
- **Process**:
  - Combines normal and accepted negotiation items
  - Processes all items in single transaction
  - Returns consolidated order list
- **Response**: List of all created `OrderDTO`

### 4. Create Negotiations from Cart
```
POST /api/v1/cart/negotiate
```
- **Purpose**: Convert negotiation cart items to formal negotiations
- **Process**:
  - Creates orders with `OrderType.NEGOTIATED`
  - Sets 3-day expiration for negotiations
  - Updates cart items with negotiation IDs
- **Response**: List of updated `CartItemDTO`

## Order Negotiation System

### Negotiation Flow

1. **Initiation Phase**
   - Buyer adds item to cart as `NEGOTIATION` type
   - System creates `OrderType.NEGOTIATED` order
   - `Negotiation` entity links to order with proposed prices

2. **Active Negotiation**
   - Real-time communication via WebSocket
   - Price proposals and counter-offers
   - 3-day expiration timer

3. **Resolution**
   - **ACCEPTED**: Converts to normal order with agreed price
   - **REJECTED**: Order cancelled, item removed from cart
   - **EXPIRED**: Auto-cancelled after 3 days

### Negotiation Statuses
- **PENDING**: Initial proposal awaiting seller response
- **COUNTERED**: Seller made counter-offer, buyer decision needed
- **ACCEPTED**: Agreement reached, converts to normal order
- **REJECTED**: Negotiation declined by seller
- **EXPIRED**: 3-day timeout reached

### Negotiation Endpoints

#### Get Negotiation Details
```
GET /api/v1/orders/{id}/negotiation
```

#### Accept Negotiation (Seller)
```
PUT /api/v1/orders/{id}/negotiation/accept
```
- Converts negotiation to confirmed order
- Updates order status to `PROCESSING`
- Updates cart item to `NEGOTIATION_ACCEPTED`

#### Reject Negotiation (Seller)
```
PUT /api/v1/orders/{id}/negotiation/reject
```
- Cancels the negotiation
- Sets order status to `CANCELLED`
- Removes item from cart

#### Make Counter Offer (Seller)
```
PUT /api/v1/orders/{id}/negotiation/counter
```
- Proposes new price (50%-150% of original)
- Extends negotiation expiration by 3 days
- Updates negotiation status to `COUNTERED`

#### Get Negotiations Lists
```
GET /api/v1/orders/negotiations/buyer
GET /api/v1/orders/negotiations/seller
```

### WebSocket Communication

#### Message Endpoint
```
POST /app/negotiation/{negotiationId}/message
```
- Real-time chat between buyer and seller
- Broadcasts to negotiation room
- Sends notifications to user queues

#### Status Updates
```
POST /app/negotiation/{negotiationId}/status
```
- Real-time negotiation status changes
- Supports: ACCEPT, REJECT, COUNTER actions
- Immediate updates to all participants

## Order Management

### Order Types
- **NORMAL**: Standard purchase order
- **NEGOTIATED**: Order created for negotiation purposes

### Order Statuses
- **PROCESSING**: Order accepted and being processed
- **CANCELLED**: Order cancelled (rejected/expired negotiations)
- Additional delivery and completion statuses

### Key Order Endpoints

#### Create Order
```
POST /api/v1/orders
```

#### Get Orders
```
GET /api/v1/orders/buyer
GET /api/v1/orders/seller
GET /api/v1/orders/{id}
```

#### Order Actions (Seller)
```
PUT /api/v1/orders/{id}/accept
PUT /api/v1/orders/{id}/reject
PUT /api/v1/orders/{id}/status
```

#### Order Satisfaction (Buyer)
```
POST /api/v1/orders/{id}/satisfaction
```

## Payment Integration

### Payment Methods
- Integrated with checkout requests
- Supports wallet payments and other methods
- Payment processing through `PaymentService`

### Wallet Integration
- Links to `WalletService` for payment processing
- Transaction tracking through `WalletTransaction` entities

## Business Rules

### Price Validation
- Negotiation proposals: 50%-150% of original price
- Counter offers: Same 50%-150% validation
- Prevents unrealistic pricing

### Time Limits
- Negotiations expire after 3 days
- Counter offers extend deadline by 3 days
- Automatic cleanup of expired items

### Cart Management
- One active cart per user
- Automatic cart recreation after full checkout
- Expired negotiation items auto-removed

## Automated Processes

### Scheduled Tasks
- **Hourly Expiration Check**: Auto-expire old negotiations
- **Cart Cleanup**: Remove expired negotiation items
- **Status Updates**: Update related orders on expiration

## Error Handling

### Common Exceptions
- `OrderException`: Order-related errors
- Validation errors for price limits
- Authorization checks for user permissions
- Entity not found errors

### Response Format
All endpoints return `EndPointResponse<T>` with:
- `data`: Response payload
- `message`: Descriptive message
- `success`: Boolean success indicator

## Data Flow Summary

1. **Cart Addition** → Item added with type (NORMAL/NEGOTIATION)
2. **Checkout Selection** → Choose appropriate checkout method
3. **Order Creation** → Orders generated based on cart item types
4. **Negotiation** (if applicable) → Real-time price negotiation
5. **Payment Processing** → Handle payment through selected method
6. **Order Fulfillment** → Delivery tracking and satisfaction confirmation
