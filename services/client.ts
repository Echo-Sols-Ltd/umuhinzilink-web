import axios, { AxiosInstance, AxiosResponse, AxiosProgressEvent, CancelToken, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { API_CONFIG, API_ENDPOINTS, HTTP_STATUS } from './constants';
import { ApiResponse, AuthResponse } from '@/types';
import { withRetry, retryConfigs, RetryOptions, isTransientRequestError } from '@/lib/retry';
import { withTimeout, timeoutConfigs, TimeoutError } from '@/lib/timeout';

function isIdempotentRequest(config: InternalAxiosRequestConfig): boolean {
  const method = config.method?.toUpperCase() ?? 'GET';
  return method === 'GET' || method === 'HEAD' || method === 'OPTIONS';
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private logoutListeners: (() => void)[] = [];
  private maxRefreshAttempts: number = 3;
  private refreshPromise: Promise<boolean> | null = null;
  private readonly defaultTimeout = API_CONFIG.TIMEOUT;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}`,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => status < 500,
    });

    this.axiosInstance.interceptors.request.use(
      async config => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      async (response: AxiosResponse) => {
        const originalRequest = response.config as InternalAxiosRequestConfig & { _retryAfterRefresh?: boolean };
        const url = originalRequest.url ?? '';

        if (
          response.status === HTTP_STATUS.UNAUTHORIZED &&
          !url.includes('/auth/') &&
          !originalRequest._retryAfterRefresh
        ) {
          originalRequest._retryAfterRefresh = true;
          const refreshed = await this.tryRefreshToken();
          if (refreshed) {
            const token = this.getAuthToken();
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.axiosInstance(originalRequest);
          }
          this.logout();
          return Promise.reject(
            new AxiosError(
              'Session expired',
              'ERR_BAD_REQUEST',
              originalRequest,
              response,
            ),
          );
        }

        return response;
      },
      async error => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retryCount?: number; _retryAfterRefresh?: boolean };
        if (!originalRequest) {
          return Promise.reject(error);
        }
        if (!originalRequest._retryCount) {
          originalRequest._retryCount = 0;
        }

        try {
          if (error.response) {
            const status = error.response.status;
            const url = originalRequest.url ?? '';

            if (status === HTTP_STATUS.UNAUTHORIZED && !url.includes('/auth/')) {
              if (!originalRequest._retryAfterRefresh) {
                originalRequest._retryAfterRefresh = true;
                const refreshed = await this.tryRefreshToken();
                if (refreshed) {
                  const token = this.getAuthToken();
                  if (token) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                  }
                  return this.axiosInstance(originalRequest);
                }
              }
              this.logout();
              throw error;
            }

            if (
              isIdempotentRequest(originalRequest) &&
              status >= 500 &&
              status < 600 &&
              originalRequest._retryCount < this.maxRefreshAttempts
            ) {
              originalRequest._retryCount++;
              const delay = 1000 * originalRequest._retryCount;
              await new Promise(res => setTimeout(res, delay));
              return this.axiosInstance(originalRequest);
            }

            throw error;
          }

          if (
            isIdempotentRequest(originalRequest) &&
            (error.code === 'ECONNABORTED' || error.message === 'Network Error' || isTransientRequestError(error))
          ) {
            if (originalRequest._retryCount < this.maxRefreshAttempts) {
              originalRequest._retryCount++;
              const delay = 1000 * originalRequest._retryCount;
              await new Promise(res => setTimeout(res, delay));
              return this.axiosInstance(originalRequest);
            }
            throw new Error('Network error after multiple retries');
          }

          throw error;
        } catch (err) {
          return Promise.reject(err);
        }
      }
    );
  }

  private getAuthToken() {
    try {
      return localStorage.getItem('auth_token');
    } catch {
      return null;
    }
  }

  private async tryRefreshToken(): Promise<boolean> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) return false;

        const response = await axios.post<ApiResponse<AuthResponse>>(
          `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}${API_ENDPOINTS.AUTH.REFRESH}`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data?.success && response.data.data?.token) {
          localStorage.setItem('auth_token', response.data.data.token);
          if (response.data.data.refreshToken) {
            localStorage.setItem('refresh_token', response.data.data.refreshToken);
          }
          if (response.data.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
          }
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  public async logout() {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('seller');
    } catch {
    } finally {
      this.logoutListeners.forEach(callback => {
        try {
          callback();
        } catch { }
      });
    }
  }

  public onLogout(callback: () => void) {
    this.logoutListeners.push(callback);
  }

  public removeLogoutListener(callback: () => void) {
    this.logoutListeners = this.logoutListeners.filter(cb => cb !== callback);
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>, options?: { timeout?: number; retry?: RetryOptions }): Promise<T> {
    const operation = async () => {
      const response = await this.axiosInstance.get<T>(endpoint, {
        params,
        timeout: options?.timeout ?? this.defaultTimeout
      });
      return response.data;
    };

    if (options?.retry) {
      return withRetry(operation, options.retry);
    }

    try {
      return await withTimeout(operation(), options?.timeout ?? this.defaultTimeout);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new Error(`Request timed out after ${error.timeout}ms`);
      }
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: unknown, options?: { timeout?: number; retry?: RetryOptions }): Promise<T> {
    const operation = async () => {
      const response = await this.axiosInstance.post<T>(endpoint, data, {
        timeout: options?.timeout ?? this.defaultTimeout
      });
      return response.data;
    };

    if (options?.retry) {
      return withRetry(operation, options.retry);
    }

    try {
      return await withTimeout(operation(), options?.timeout ?? this.defaultTimeout);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new Error(`Request timed out after ${error.timeout}ms`);
      }
      throw error;
    }
  }

  async put<T>(endpoint: string, data?: unknown, options?: { timeout?: number; retry?: RetryOptions }): Promise<T> {
    const operation = async () => {
      const response = await this.axiosInstance.put<T>(endpoint, data, {
        timeout: options?.timeout ?? this.defaultTimeout
      });
      return response.data;
    };

    if (options?.retry) {
      return withRetry(operation, options.retry);
    }

    try {
      return await withTimeout(operation(), options?.timeout ?? this.defaultTimeout);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new Error(`Request timed out after ${error.timeout}ms`);
      }
      throw error;
    }
  }

  async patch<T>(endpoint: string, data?: unknown, options?: { timeout?: number; retry?: RetryOptions }): Promise<T> {
    const operation = async () => {
      const response = await this.axiosInstance.patch<T>(endpoint, data, {
        timeout: options?.timeout ?? this.defaultTimeout
      });
      return response.data;
    };

    if (options?.retry) {
      return withRetry(operation, options.retry);
    }

    try {
      return await withTimeout(operation(), options?.timeout ?? this.defaultTimeout);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new Error(`Request timed out after ${error.timeout}ms`);
      }
      throw error;
    }
  }

  async delete<T>(endpoint: string, options?: { timeout?: number; retry?: RetryOptions }): Promise<T> {
    const operation = async () => {
      const response = await this.axiosInstance.delete<T>(endpoint, {
        timeout: options?.timeout ?? this.defaultTimeout
      });
      return response.data;
    };

    if (options?.retry) {
      return withRetry(operation, options.retry);
    }

    try {
      return await withTimeout(operation(), options?.timeout ?? this.defaultTimeout);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new Error(`Request timed out after ${error.timeout}ms`);
      }
      throw error;
    }
  }

  async uploadFile<T>(
    endpoint: string,
    file: File,
    onUploadProgress?: (event: AxiosProgressEvent) => void,
    cancelToken?: CancelToken,
    timeout?: number
  ): Promise<T> {
    const operation = async () => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await this.axiosInstance.post<T>(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
        cancelToken,
        timeout: timeout ?? timeoutConfigs.long,
      });

      return response.data;
    };

    return withRetry(operation, retryConfigs.fileUpload);
  }

  async getWithRetry<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.get(endpoint, params, { retry: retryConfigs.networkRequest });
  }

  async postWithRetry<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.post(endpoint, data, { retry: retryConfigs.networkRequest });
  }

  async getCritical<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.get(endpoint, params, {
      timeout: timeoutConfigs.critical,
      retry: retryConfigs.critical
    });
  }

  async postCritical<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.post(endpoint, data, {
      timeout: timeoutConfigs.critical,
      retry: retryConfigs.critical
    });
  }
}

export const apiClient = new ApiClient();
