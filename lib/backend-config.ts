/**
 * Shared utility for getting the backend API base URL
 * This ensures consistency across all API routes and client-side code
 */

/**
 * Get the backend base URL (without /api/v1)
 * For use in client-side code (services/client.ts)
 */
export function getBackendBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use NEXT_PUBLIC_API_BASE_URL
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1$/, '') ||
      'http://localhost:8080'
    );
  } else {
    // Server-side: use API_BASE_URL
    return (
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1$/, '') ||
      'http://localhost:8080'
    );
  }
}

/**
 * Get the full backend API URL (with /api/v1)
 * For use in Next.js API routes
 */
export function getBackendApiUrl(): string {
  const baseUrl = getBackendBaseUrl();
  // Check if the URL already includes /api/v1
  if (baseUrl.includes('/api/v1')) {
    return baseUrl;
  }
  // Otherwise, construct it
  return `${baseUrl.replace(/\/$/, '')}/api/v1`;
}

/**
 * Get the backend API URL from environment variables
 * This is the fallback function used in Next.js API routes
 */
export function getBackendBaseUrlFromEnv(): string {
  // First check for full URL with /api/v1
  const fullUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;
  if (fullUrl && fullUrl.includes('/api/v1')) {
    return fullUrl;
  }
  
  // Otherwise, construct from base URL
  const baseUrl = process.env.API_BASE_URL || 
                  process.env.NEXT_PUBLIC_API_BASE_URL ||
                  process.env.NEXT_PUBLIC_API_URL ||
                  'http://localhost:8080';
  
  // If it doesn't already have /api/v1, add it
  if (!baseUrl.includes('/api/v1')) {
    return `${baseUrl.replace(/\/$/, '')}/api/v1`;
  }
  
  return baseUrl;
}

