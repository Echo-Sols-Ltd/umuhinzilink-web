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
 * API error structure.
 */
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Generic socket response wrapper.
 */
export interface SocketResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: Sort;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}
