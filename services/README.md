# Services Documentation

## Dashboard Service

The dashboard service provides a comprehensive API layer for fetching and managing dashboard data across all user roles in the UmuhinziLink application. It leverages the existing `apiClient` for robust HTTP handling with retry logic, timeout management, and authentication.

### Features

- **🔗 Robust API Client** - Uses the existing axios-based client with retry logic
- **🎯 Role-Based Endpoints** - Separate endpoints for each user type
- **⚡ Performance Optimization** - Built-in caching layer (5-minute cache)
- **🛡️ Enhanced Error Handling** - Comprehensive error management with user-friendly messages
- **🔄 Real-time Updates** - WebSocket placeholder for live dashboard updates
- **📊 Export Functionality** - Export dashboard data as PDF/Excel/CSV
- **🎣 Custom Metrics** - Support for fetching specific dashboard metrics
- **🔁 Automatic Retry** - Built-in retry logic for failed requests
- **⏱️ Timeout Management** - Configurable timeouts for different operations

### Architecture

The dashboard service is built on top of the existing `apiClient` which provides:

- **Authentication** - Automatic token management and refresh
- **Retry Logic** - Configurable retry with exponential backoff
- **Timeout Handling** - Prevents hanging requests
- **Error Interceptors** - Centralized error handling
- **Request/Response Interceptors** - Automatic header management

### API Endpoints

The service uses the following endpoints defined in `constants.ts`:

```typescript
DASHBOARD: {
  FARMER_STATS: '/dashboard/farmer',
  SUPPLIER_STATS: '/dashboard/supplier', 
  BUYER_STATS: '/dashboard/buyer',
  ADMIN_STATS: '/dashboard/admin',
  GOVERNMENT_STATS: '/dashboard/government'
}
```

### Usage

#### Basic Dashboard Service

```typescript
import { dashboardService } from '@/services/dashboardService';

// Get buyer dashboard data
const buyerData = await dashboardService.getBuyerDashboard();

// Get farmer dashboard data  
const farmerData = await dashboardService.getFarmerDashboard();
```

#### Cached Dashboard Service (Recommended)

```typescript
import { cachedDashboardService } from '@/services/dashboardService';

// Data is cached for 5 minutes with error caching
const buyerData = await cachedDashboardService.getBuyerDashboard();
```

#### Using the Dashboard Hook

```typescript
import { useDashboard } from '@/hooks/useDashboard';

function MyComponent() {
  const { data, loading, error, refetch, clearCache } = useDashboard();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* render dashboard data */}</div>;
}
```

### Service Methods

#### Core Dashboard Methods

- `getBuyerDashboard()` - Fetch buyer dashboard data
- `getFarmerDashboard()` - Fetch farmer dashboard data  
- `getSupplierDashboard()` - Fetch supplier dashboard data
- `getAdminDashboard()` - Fetch admin dashboard data
- `getGovernmentDashboard()` - Fetch government dashboard data

#### Enhanced Features

- `getNotifications()` - Fetch user notifications
- `exportDashboardData(userRole, format)` - Export dashboard as PDF/Excel/CSV
- `getDashboardInsights(userRole, timeRange)` - Get analytics insights
- `getCustomMetrics(userRole, metrics)` - Fetch specific metrics
- `refreshDashboard(userRole)` - Force refresh with retry logic
- `subscribeToDashboardUpdates(userRole, callback)` - Real-time updates

### Error Handling

The service includes comprehensive error handling with specific error types:

```typescript
import { handleDashboardError } from '@/services/dashboardService';

try {
  const data = await dashboardService.getBuyerDashboard();
} catch (error) {
  const errorResponse = handleDashboardError(error, 'BUYER');
  // errorResponse contains user-friendly error message and error type
  // Examples: 'UNAUTHORIZED', 'FORBIDDEN', 'TIMEOUT', 'NETWORK_ERROR', 'SERVER_ERROR'
}
```

#### Error Types Handled

- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Permission denied
- **404 Not Found** - Dashboard data not found
- **429 Rate Limited** - Too many requests
- **500 Server Error** - Internal server error
- **Timeout** - Request timed out
- **Network Error** - Connection issues

### Caching System

The dashboard service includes an advanced caching mechanism:

#### Features

- **Cache Duration**: 5 minutes for data, 1 minute for errors
- **Error Caching**: Prevents repeated failed requests
- **Auto Cleanup**: Automatic cleanup of expired entries
- **Selective Caching**: Different durations for data vs errors

```typescript
import { dashboardCache } from '@/services/dashboardService';

// Clear all cache
dashboardCache.clear();

// Clear only expired entries
dashboardCache.clearExpired();

// Manual cache operations
dashboardCache.set('key', data);
const cached = dashboardCache.get('key');
```

### Response Format

All dashboard methods return standardized responses:

```typescript
interface DashboardResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
```

### Performance Optimizations

#### Built-in Optimizations

1. **Request Deduplication** - Prevents duplicate simultaneous requests
2. **Smart Caching** - Reduces API calls for frequently accessed data
3. **Error Caching** - Avoids repeated failed requests
4. **Automatic Retry** - Handles transient failures
5. **Timeout Management** - Prevents hanging requests

#### Recommended Usage Patterns

```typescript
// Use cached service for better performance
const { cachedDashboardService } = await import('@/services/dashboardService');

// For real-time updates, use refresh method
const freshData = await cachedDashboardService.refreshDashboard('BUYER');

// Handle errors gracefully with specific error types
try {
  const data = await cachedDashboardService.getBuyerDashboard();
} catch (error) {
  if (error.error === 'RATE_LIMITED') {
    // Show rate limit message
  } else if (error.error === 'NETWORK_ERROR') {
    // Show offline message
  }
}
```

### TypeScript Types

The service is fully typed with TypeScript:

```typescript
import {
  BuyerDashboardData,
  FarmerDashboardData,
  SupplierDashboardData,
  AdminDashboardData,
  GovernmentDashboardData
} from '@/types/dashboard';
```

### Environment Configuration

The service automatically uses the appropriate API configuration through the `apiClient`:

```typescript
// Development: http://localhost:7022
// Production: https://api.umuhinzilink.echo-solution.com
```

### Authentication

The `apiClient` automatically handles authentication:

- **Token Management** - Automatic token inclusion in headers
- **Token Refresh** - Handles expired tokens
- **Logout Handling** - Cleans up authentication state
- **Error Interception** - Redirects on auth failures

### Advanced Features

#### Export Functionality

```typescript
// Export dashboard data
const blob = await dashboardService.exportDashboardData('BUYER', 'pdf');

// Create download link
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'dashboard-export.pdf';
a.click();
```

#### Custom Metrics

```typescript
// Fetch specific metrics
const metrics = await dashboardService.getCustomMetrics('FARMER', [
  'totalOrders',
  'revenue',
  'productCount'
]);
```

#### Real-time Updates (Future)

```typescript
// Subscribe to dashboard updates
const unsubscribe = dashboardService.subscribeToDashboardUpdates(
  'FARMER',
  (data) => {
    console.log('Real-time update:', data);
    // Update your UI state
  }
);

// Cleanup when component unmounts
return () => {
  unsubscribe();
};
```

## Future Enhancements

1. **WebSocket Implementation** - Complete real-time dashboard updates
2. **Offline Support** - Cache data for offline viewing
3. **Data Validation** - Client-side validation of API responses
4. **Request Queuing** - Queue requests when offline
5. **Analytics Integration** - Track dashboard usage patterns

## Contributing

When adding new dashboard features:

1. **Update Types** - Add new types to `@/types/dashboard.ts`
2. **Add Endpoints** - Update `constants.ts` if needed
3. **Implement Service** - Add method to `dashboardService.ts`
4. **Add Caching** - Update `cachedDashboardService` if applicable
5. **Error Handling** - Add specific error types to `handleDashboardError`
6. **Update Hooks** - Add new functionality to `useDashboard.ts`
7. **Update Tests** - Add test coverage for new features

## Support

For issues or questions about the dashboard service:

1. **Check Console** - Look for detailed error messages
2. **Verify API** - Ensure endpoints are accessible
3. **Check Auth** - Verify authentication tokens are valid
4. **Network** - Check connectivity and CORS settings
5. **Cache Debug** - Clear cache and retry if needed

## Performance Monitoring

The service includes built-in performance monitoring:

- **Request Timing** - Track API response times
- **Cache Hit Rates** - Monitor caching effectiveness
- **Error Rates** - Track failed request patterns
- **Retry Attempts** - Monitor network reliability
