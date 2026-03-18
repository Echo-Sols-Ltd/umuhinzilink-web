/**
 * Generic API response wrapper.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message: string;
}

/**
 * API response for paginated data.
 */
export interface PaginatedResponse<T> {
  success: boolean,
  data: T,
  message: string,
  pageNumber: number,
  pageSize: number,
  totalElements: number,
  totalPages: number,
  first: boolean,
  last: boolean
}

/**
 * Generic socket response wrapper.
 */
export interface SocketResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

