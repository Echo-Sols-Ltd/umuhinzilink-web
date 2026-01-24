# Design Document: UmuhinziLink Project Finalization

## Overview

This design document outlines the technical approach for finalizing the UmuhinziLink agricultural marketplace platform. The platform is a Next.js frontend application that connects farmers, buyers, suppliers, government officials, and administrators in Rwanda's agricultural ecosystem.

The backend API is fully implemented with comprehensive endpoints for authentication, product management, order processing, payments, messaging, and analytics. The frontend has a solid foundation with service layers, context management, and UI components, but requires significant completion to provide a fully functional marketplace experience.

## Architecture

### System Architecture

The UmuhinziLink platform follows a modern web application architecture:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │   Database      │
│   (Next.js)     │◄──►│   (Spring Boot)  │◄──►│   (PostgreSQL)  │
│                 │    │                  │    │                 │
│ - React Pages   │    │ - REST API       │    │ - User Data     │
│ - Context State │    │ - WebSocket      │    │ - Products      │
│ - Service Layer │    │ - JWT Auth       │    │ - Orders        │
│ - UI Components │    │ - File Upload    │    │ - Messages      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Frontend Architecture

```
app/
├── (auth)/           # Authentication pages
├── admin/           # Admin dashboard and management
├── buyer/           # Buyer dashboard and features
├── farmer/          # Farmer dashboard and features
├── supplier/        # Supplier dashboard and features
├── government/      # Government oversight dashboard
└── shared/          # Shared pages and components

components/
├── ui/              # Reusable UI components (Shadcn/UI)
├── admin/           # Admin-specific components
├── buyer/           # Buyer-specific components
├── farmer/          # Farmer-specific components
├── supplier/        # Supplier-specific components
└── government/      # Government-specific components

contexts/
├── AuthContext     # Authentication state management
├── ProductContext  # Product data management
├── OrderContext    # Order data management
├── MessageContext  # Real-time messaging
└── SocketContext   # WebSocket connection management

services/
├── client.ts       # HTTP client with interceptors
├── auth.ts         # Authentication services
├── products.ts     # Product management services
├── orders.ts       # Order management services
├── socket.ts       # WebSocket services
└── constants.ts    # API endpoints and configuration
```

## Components and Interfaces

### Core Service Layer

#### API Client (`services/client.ts`)
- **Purpose**: Centralized HTTP client with authentication, retry logic, and error handling
- **Features**: 
  - Automatic JWT token injection
  - Request/response interceptors
  - Retry mechanism for failed requests
  - File upload support with progress tracking
  - Automatic logout on authentication failures

#### Authentication Service (`services/auth.ts`)
- **Purpose**: Handle all authentication-related operations
- **Methods**:
  - `login(credentials)` - User authentication
  - `register(userData)` - Generic user registration
  - `registerFarmer/Buyer/Supplier(data)` - Role-specific registration
  - `logout()` - Session termination
  - `checkToken()` - Token validation
  - `verifyOtp(code)` - OTP verification

#### Product Service (`services/products.ts`)
- **Purpose**: Manage product CRUD operations
- **Methods**:
  - `createFarmerProduct/SupplierProduct(data)` - Product creation
  - `updateFarmerProduct/SupplierProduct(id, data)` - Product updates
  - `deleteFarmerProduct/SupplierProduct(id)` - Product deletion
  - `getProductsByFarmer/Supplier()` - User's products
  - `getBuyerProducts()` - Products for buyers
  - `getFarmerStats/SupplierStats()` - Analytics data

#### Order Service (`services/orders.ts`)
- **Purpose**: Handle order lifecycle management
- **Methods**:
  - `createFarmerOrder/SupplierOrder(data)` - Order creation
  - `getBuyerOrders()` - Buyer's order history
  - `getFarmerOrders/SupplierOrders()` - Seller's orders
  - `acceptFarmerOrder/SupplierOrder(id)` - Order acceptance
  - `updateOrderStatus(id, status)` - Status updates

### Context Management System

#### AuthContext
- **State**: `user`, `farmer`, `buyer`, `supplier`, `loading`
- **Actions**: Login, logout, registration, profile management
- **Features**: Automatic role-based routing, token management

#### ProductContext
- **State**: `farmerProducts`, `buyerProducts`, `loading`, `error`
- **Actions**: Product CRUD operations, search, filtering
- **Features**: Real-time product updates, caching

#### OrderContext
- **State**: `buyerOrders`, `farmerOrders`, `supplierOrders`, `loading`
- **Actions**: Order creation, status updates, history retrieval
- **Features**: Order tracking, notifications

#### SocketContext
- **Purpose**: WebSocket connection management for real-time features
- **Features**: 
  - Automatic connection/reconnection
  - Message broadcasting
  - Online user tracking
  - Typing indicators

### User Interface Components

#### Dashboard Components
- **FarmerDashboard**: Revenue analytics, product management, order tracking
- **BuyerDashboard**: Purchase history, product discovery, market trends
- **SupplierDashboard**: Inventory management, order fulfillment
- **AdminDashboard**: Platform oversight, user management, analytics
- **GovernmentDashboard**: Market insights, trade monitoring

#### Shared UI Components (Shadcn/UI)
- Form components: Input, Select, Textarea, Checkbox, Radio
- Navigation: Sidebar, Navbar, Breadcrumbs
- Data display: Table, Card, Badge, Avatar
- Feedback: Toast, Alert, Dialog, Loading states
- Layout: Container, Grid, Flex utilities

## Data Models

### User Models

```typescript
interface User {
  id: string;
  names: string;
  email: string;
  phoneNumber: string;
  role: UserType;
  verified: boolean;
  avatar?: string;
  address?: Address;
  createdAt: string;
  updatedAt: string;
}

interface Farmer extends User {
  farmSize: FarmSize;
  crops: CropType[];
  experienceLevel: ExperienceLevel;
  certification?: CertificationType;
}

interface Buyer extends User {
  buyerType: BuyerType;
  savedProducts: string[];
}

interface Supplier extends User {
  businessName: string;
  supplierType: SupplierType;
}
```

### Product Models

```typescript
interface FarmerProduct {
  id: string;
  farmer: Farmer;
  name: CropType;
  category: ProductCategory;
  description: string;
  unitPrice: number;
  measurementUnit: MeasurementUnit;
  quantity: number;
  harvestDate: Date;
  location: string;
  isNegotiable: boolean;
  certification: CertificationType;
  productStatus: ProductStatus;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface SupplierProduct {
  id: string;
  supplier: Supplier;
  name: SupplierProductType;
  category: SupplierCategory;
  description: string;
  unitPrice: number;
  measurementUnit: MeasurementUnit;
  quantity: number;
  location: string;
  isNegotiable: boolean;
  certification: CertificationType;
  productStatus: ProductStatus;
  image?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Order Models

```typescript
interface FarmerOrder {
  id: string;
  buyer: Buyer;
  product: FarmerProduct;
  quantity: number;
  totalPrice: number;
  isPaid: boolean;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryDate?: Date;
  createdAt: string;
  updatedAt: string;
}

interface SupplierOrder {
  id: string;
  buyer: Buyer;
  product: SupplierProduct;
  quantity: number;
  totalPrice: number;
  isPaid: boolean;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryDate?: Date;
  createdAt: string;
  updatedAt: string;
}
```

### Message Models

```typescript
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: MessageType;
  timestamp: Date;
  isRead: boolean;
  isEdited: boolean;
  replyTo?: string;
}

interface ChatConversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}
```

Now I need to use the prework tool to analyze the acceptance criteria before writing the correctness properties:

<function_calls>
<invoke name="prework">
<parameter name="featureName">project-finalization
## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Real-time Message Delivery
*For any* valid message sent through the WebSocket system, the message should be delivered instantly to the intended recipient and displayed in their UI without requiring a page refresh.
**Validates: Requirements 1.1, 1.2**

### Property 2: Message Operations Consistency
*For any* message operation (edit, delete, typing indicator), all participants in the conversation should see the same state changes in real-time.
**Validates: Requirements 1.3, 1.5, 1.6, 1.7**

### Property 3: File Upload and Management
*For any* file upload operation, the system should provide progress indication, format validation, and successful uploads should be immediately available for preview and management.
**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.6, 4.7**

### Property 4: Dashboard Metrics Accuracy
*For any* user role (farmer, buyer, supplier, admin, government), their dashboard should display accurate metrics calculated from their associated data and update automatically when underlying data changes.
**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

### Property 5: Search and Filter Functionality
*For any* search query or filter combination, the search engine should return only products that match all specified criteria and display complete product information.
**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

### Property 6: Order Lifecycle Management
*For any* order created in the system, all parties should receive appropriate notifications for status changes, and the order should maintain data integrity throughout its lifecycle.
**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.7**

### Property 7: Payment System Integrity
*For any* payment operation, the system should maintain accurate wallet balances, provide transaction receipts, and handle insufficient funds appropriately with proper security measures.
**Validates: Requirements 6.1, 6.3, 6.4, 6.5, 6.8**

### Property 8: Admin Management Operations
*For any* admin management action (user, product, order, content moderation), the system should execute the action correctly and provide appropriate feedback and audit trails.
**Validates: Requirements 7.1, 7.2, 7.3, 7.6**

### Property 9: Government Data Aggregation
*For any* government oversight function, the system should provide accurate aggregated data, trend analysis, and export capabilities while maintaining data privacy.
**Validates: Requirements 8.1, 8.2, 8.5, 8.8**

### Property 10: Responsive Design Consistency
*For any* device or screen size, the system should maintain consistent functionality while adapting layouts appropriately for the device capabilities.
**Validates: Requirements 9.1, 9.2, 9.4, 9.5**

### Property 11: Error Handling and User Feedback
*For any* error condition or successful operation, the system should provide appropriate user feedback, error messages with suggested actions, and recovery mechanisms.
**Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6**

### Property 12: Message History Pagination
*For any* conversation with multiple messages, the system should load message history with proper pagination and maintain chronological order.
**Validates: Requirements 1.8**

### Property 13: Chart Interactivity
*For any* analytics chart, the system should provide interactive features including date range filtering and responsive data visualization.
**Validates: Requirements 2.7**

### Property 14: Data Export Functionality
*For any* data export request, the system should generate reports in common formats suitable for the user's role and requirements.
**Validates: Requirements 2.8**

### Property 15: Search Suggestions
*For any* search query that returns no results, the system should provide alternative search terms or suggest similar products.
**Validates: Requirements 3.7**

### Property 16: Saved Search Alerts
*For any* saved search criteria, the system should create alerts when new products match the specified criteria.
**Validates: Requirements 3.8**

### Property 17: Upload Error Handling
*For any* failed file upload, the system should display clear error messages and provide retry options.
**Validates: Requirements 4.5**

### Property 18: Chunked Upload Reliability
*For any* large file upload, the system should implement chunked upload to ensure reliability and handle network interruptions.
**Validates: Requirements 4.8**

### Property 19: Order Review System
*For any* completed order, buyers should be able to rate and review the transaction.
**Validates: Requirements 5.6**

### Property 20: Order Dispute Handling
*For any* order dispute, the system should provide mechanisms to flag orders for admin review.
**Validates: Requirements 5.8**

### Property 21: Payment Method Support
*For any* deposit operation, the system should support multiple payment methods with clear instructions.
**Validates: Requirements 6.2**

### Property 22: Payment History Filtering
*For any* payment history view, the system should allow filtering by date, amount, and transaction type.
**Validates: Requirements 6.6**

### Property 23: Payment Error Recovery
*For any* failed payment, the system should provide clear error messages and alternative payment options.
**Validates: Requirements 6.7**

### Property 24: Admin Monitoring and Reporting
*For any* admin monitoring function, the system should display comprehensive analytics and provide diagnostic tools for system issues.
**Validates: Requirements 7.4, 7.5, 7.7**

### Property 25: Admin Configuration Management
*For any* system configuration change, admins should be able to modify parameters and the changes should take effect correctly.
**Validates: Requirements 7.8**

### Property 26: Government Compliance Monitoring
*For any* compliance tracking function, the system should monitor certification usage and quality standards adherence.
**Validates: Requirements 8.3**

### Property 27: Government User Activity Insights
*For any* user activity analysis, the system should provide anonymized insights while protecting user privacy.
**Validates: Requirements 8.4**

### Property 28: Government Market Monitoring
*For any* unusual trading pattern, the system should flag potential market manipulation for government review.
**Validates: Requirements 8.6**

### Property 29: Government Farmer Support Identification
*For any* performance analysis, the system should identify underperforming regions or crops needing assistance.
**Validates: Requirements 8.7**

### Property 30: Performance Optimization
*For any* slow network connection, the system should optimize performance with progressive loading and appropriate loading states.
**Validates: Requirements 9.3, 9.7**

### Property 31: Offline Functionality
*For any* offline access attempt, the system should provide graceful degradation with cached content where possible.
**Validates: Requirements 9.6**

### Property 32: Accessibility Support
*For any* accessibility feature usage, the system should support screen readers and keyboard navigation.
**Validates: Requirements 9.8**

### Property 33: Timeout Handling
*For any* operation timeout, the system should offer retry mechanisms and alternative approaches.
**Validates: Requirements 10.6**

### Property 34: Critical Error Management
*For any* critical error, the system should log details for debugging while showing safe user messages.
**Validates: Requirements 10.7**

### Property 35: User Help and Support
*For any* help request, the system should provide contextual assistance and support contact information.
**Validates: Requirements 10.8**

## Error Handling

### Client-Side Error Handling

#### Network Errors
- **Connection failures**: Display offline indicators and retry mechanisms
- **Timeout errors**: Show timeout messages with manual retry options
- **Rate limiting**: Implement exponential backoff and user notifications

#### Validation Errors
- **Form validation**: Real-time field validation with specific error messages
- **File upload validation**: Size, format, and content validation with clear feedback
- **Input sanitization**: Prevent XSS and injection attacks

#### Authentication Errors
- **Token expiration**: Automatic token refresh or redirect to login
- **Permission errors**: Clear messaging about insufficient permissions
- **Session management**: Secure session handling with automatic cleanup

### Server Communication Error Handling

#### API Error Responses
- **4xx errors**: User-friendly messages with corrective actions
- **5xx errors**: Generic error messages with support contact information
- **Network errors**: Retry mechanisms with exponential backoff

#### WebSocket Error Handling
- **Connection drops**: Automatic reconnection with visual indicators
- **Message delivery failures**: Retry mechanisms and failure notifications
- **Authentication failures**: Graceful degradation and re-authentication prompts

### User Experience Error Handling

#### Loading States
- **Skeleton screens**: Show content structure while loading
- **Progress indicators**: Visual feedback for long-running operations
- **Timeout handling**: Clear messaging when operations take too long

#### Fallback Mechanisms
- **Offline functionality**: Cached content and offline indicators
- **Graceful degradation**: Core functionality available when features fail
- **Alternative workflows**: Backup processes when primary flows fail

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit testing and property-based testing to ensure comprehensive coverage:

#### Unit Testing
Unit tests focus on specific examples, edge cases, and integration points:
- **Component testing**: Individual React component behavior
- **Service testing**: API service method functionality
- **Context testing**: State management and side effects
- **Integration testing**: Component interaction and data flow
- **Edge case testing**: Boundary conditions and error scenarios

#### Property-Based Testing
Property tests verify universal properties across all inputs:
- **Data integrity**: Ensure data consistency across operations
- **Business logic**: Verify core business rules hold for all inputs
- **UI behavior**: Test interface responsiveness and state management
- **API contracts**: Validate request/response patterns
- **Real-time features**: Test WebSocket message delivery and state synchronization

### Property Test Configuration

#### Testing Framework
- **Library**: Use `fast-check` for TypeScript property-based testing
- **Integration**: Integrate with Jest testing framework
- **Configuration**: Minimum 100 iterations per property test
- **Tagging**: Each test references its design document property

#### Test Structure
```typescript
// Example property test structure
describe('Feature: project-finalization, Property 1: Real-time Message Delivery', () => {
  it('should deliver messages instantly via WebSocket', async () => {
    await fc.assert(fc.asyncProperty(
      fc.record({
        senderId: fc.string(),
        receiverId: fc.string(),
        content: fc.string(),
        messageType: fc.constantFrom('TEXT', 'IMAGE', 'FILE')
      }),
      async (message) => {
        // Test implementation
        const delivered = await sendMessage(message);
        expect(delivered).toBe(true);
        expect(await getReceivedMessage(message.receiverId)).toEqual(message);
      }
    ), { numRuns: 100 });
  });
});
```

### Testing Coverage Requirements

#### Frontend Testing
- **Component coverage**: 90%+ line coverage for UI components
- **Service coverage**: 95%+ coverage for API services and utilities
- **Context coverage**: 100% coverage for state management contexts
- **Integration coverage**: Key user workflows end-to-end

#### Property Testing Coverage
- **Business logic**: All correctness properties implemented as property tests
- **Data validation**: Input validation and sanitization properties
- **State management**: Context state consistency properties
- **Real-time features**: WebSocket communication properties

### Test Environment Setup

#### Development Testing
- **Local testing**: Jest with jsdom for component testing
- **API mocking**: MSW (Mock Service Worker) for API mocking
- **WebSocket mocking**: Mock WebSocket server for real-time testing
- **File upload testing**: Mock file upload with progress simulation

#### Continuous Integration
- **Automated testing**: Run all tests on pull requests
- **Property test execution**: Extended property test runs on main branch
- **Performance testing**: Lighthouse CI for performance regression testing
- **Accessibility testing**: Automated a11y testing with axe-core

### Test Data Management

#### Test Data Generation
- **Factories**: Create realistic test data with factories
- **Fixtures**: Static test data for consistent scenarios
- **Random generation**: Property-based test data generation
- **Seed data**: Consistent seed data for integration tests

#### Test Database
- **In-memory database**: SQLite for fast test execution
- **Data isolation**: Clean database state between tests
- **Migration testing**: Test database schema migrations
- **Seed scripts**: Automated test data seeding