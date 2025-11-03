// Authentication utilities for role-based access control

export interface User {
  avatar: string | null;
  createdAt: string;
  id: string;
  lastLogin: string | null;
  updatedAt: string;
  verified: boolean;
  names: string;
  language: string;
  email: string;
  address: {
    district: string;
    province: string;
  } | null;
  phoneNumber: string;
  password: string;
  role: 'BUYER' | 'FARMER' | 'SUPPLIER' | 'ADMIN';
}

export interface AuthData {
  token: string;
  user: User;
}

export interface LoginResponse {
  success: boolean;
  data: AuthData;
  message: string;
}

export interface RegisterResponse {
  success: boolean;
  data: AuthData;
  message: string;
}

// Role-based dashboard routes
export const DASHBOARD_ROUTES = {
  BUYER: '/buyer_dashboard',
  FARMER: '/farmer_dashboard',
  SUPPLIER: '/supplier_dashboard',
  ADMIN: '/admin/dashboard',
} as const;

// Authentication storage keys
export const AUTH_KEYS = {
  TOKEN: 'authToken',
  USER: 'user',
  ROLE: 'userRole',
} as const;

/**
 * Get the current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;

  try {
    const userStr = localStorage.getItem(AUTH_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

/**
 * Get the current auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_KEYS.TOKEN);
}

/**
 * Get the current user role from localStorage
 */
export function getUserRole(): User['role'] | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_KEYS.ROLE) as User['role'] | null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!(getAuthToken() && getCurrentUser());
}

/**
 * Store authentication data in localStorage
 */
export function storeAuthData(authData: AuthData): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(AUTH_KEYS.TOKEN, authData.token);
  localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(authData.user));
  localStorage.setItem(AUTH_KEYS.ROLE, authData.user.role);
}

/**
 * Clear all authentication data from localStorage
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(AUTH_KEYS.TOKEN);
  localStorage.removeItem(AUTH_KEYS.USER);
  localStorage.removeItem(AUTH_KEYS.ROLE);
}

/**
 * Get the dashboard route for a specific role
 */
export function getDashboardRoute(role: User['role']): string {
  return DASHBOARD_ROUTES[role] || DASHBOARD_ROUTES.FARMER;
}

/**
 * Check if user has a specific role
 */
export function hasRole(role: User['role']): boolean {
  const userRole = getUserRole();
  return userRole === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(roles: User['role'][]): boolean {
  const userRole = getUserRole();
  return userRole ? roles.includes(userRole) : false;
}

/**
 * Redirect to appropriate dashboard based on user role
 */
export function redirectToDashboard(
  router: { push: (path: string) => void },
  role?: User['role']
): void {
  const userRole = role || getUserRole();
  if (!userRole) {
    console.warn('No role found, redirecting to farmer dashboard');
    router.push(DASHBOARD_ROUTES.FARMER);
    return;
  }

  const dashboardRoute = getDashboardRoute(userRole);
  console.log(`Redirecting to ${dashboardRoute} for role: ${userRole}`);
  router.push(dashboardRoute);
}

/**
 * Logout user and clear all authentication data
 */
export function logout(router?: { push: (path: string) => void }): void {
  console.log('Logging out user');
  clearAuthData();

  if (router) {
    router.push('/signin?logout=true');
  } else if (typeof window !== 'undefined') {
    window.location.href = '/signin?logout=true';
  }
}

/**
 * Make authenticated API request with token
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();

  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Refresh token if needed (placeholder for future implementation)
 */
export async function refreshToken(): Promise<boolean> {
  // TODO: Implement token refresh logic when backend supports it
  console.warn('Token refresh not implemented yet');
  return false;
}

/**
 * Check if token is expired (basic check)
 */
export function isTokenExpired(): boolean {
  const token = getAuthToken();
  if (!token) return true;

  try {
    // Basic JWT token expiration check
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
}
