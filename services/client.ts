import axios, { AxiosInstance, AxiosResponse, AxiosProgressEvent, CancelToken } from 'axios';
import { API_CONFIG, HTTP_STATUS } from './constants';
import { ApiResponse } from '@/types';


class ApiClient {
  private axiosInstance: AxiosInstance;

  private logoutListeners: (() => void)[] = [];
  private maxRefreshAttempts: number = 3;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}`,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const token = await this.getAuthToken();

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        } catch (error) {
          return Promise.reject(error);
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;
        // Initialize retry count per request
        if (!originalRequest._retryCount) {
          originalRequest._retryCount = 0;
        }

        try {
          if (error.response) {
            const status = error.response.status;

            if (status === HTTP_STATUS.UNAUTHORIZED || status === HTTP_STATUS.FORBIDDEN) {
              console.warn('401 Unauthorized detected, logging out');
              this.logout();
              throw error;
            }

            // Retry only server-side errors (5xx)
            if (status >= 500 && status < 600 && originalRequest._retryCount < this.maxRefreshAttempts) {
              originalRequest._retryCount++;
              const delay = 1000 * originalRequest._retryCount; // 1s, 2s, 3s backoff
              await new Promise((res) => setTimeout(res, delay));
              return this.axiosInstance(originalRequest);
            }

            throw error;
          }

          // Handle network or timeout errors
          if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
            if (originalRequest._retryCount < this.maxRefreshAttempts) {
              originalRequest._retryCount++;
              const delay = 1000 * originalRequest._retryCount;
              await new Promise((res) => setTimeout(res, delay));
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

  private async getAuthToken(): Promise<string | null> {
    try {
      return await localStorage.getItemAsync('auth_token')
    } catch {
      this.logout();
      return null;
    }
  }

  // private async handleUnauthorized() {
  //   try {

  //     if (this.refreshAttempts >= this.maxRefreshAttempts) {
  //       this.logout();
  //       throw new Error('Max refresh attempts exceeded');
  //     }
  //     this.refreshAttempts++;
  //     const refreshToken = await SecureStore.getItemAsync('refresh_token');
  //     if (!refreshToken) {
  //       throw new Error('No refresh token available');
  //     }
  //     const response = await axios.post(
  //       `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}/auth/refresh`,
  //       { refreshToken },
  //       { headers: { 'Content-Type': 'application/json' } }
  //     );
  //     if (response.status === HTTP_STATUS.OK) {
  //       const { accessToken } = response.data;
  //       await SecureStore.setItemAsync('access_token', accessToken);
  //       this.refreshAttempts = 0;
  //     } else {
  //       throw new Error('Refresh token invalid or expired');
  //     }
  //   } catch (error) {
  //     this.logout();
  //     throw error;
  //   }
  // }

  public async logout() {
    try {

      await localStorage.removeItemAsync('auth_token')
      await localStorage.removeItemAsync('user')
      await localStorage.removeItemAsync('farmer')
      await localStorage.removeItemAsync('supplier')
      await localStorage.removeItemAsync('buyer')
      await localStorage.clear()
     

    } catch {
    } finally {
      this.logoutListeners.forEach((callback) => {
        try {
          callback();
        } catch {
        }
      });
    }
  }

  public onLogout(callback: () => void) {
    try {
      this.logoutListeners.push(callback);
    } catch {
    }
  }

  public removeLogoutListener(callback: () => void) {
    try {
      this.logoutListeners = this.logoutListeners.filter(cb => cb !== callback);
    } catch {
    }
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<T>>(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error) {

      throw error;
    }
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<ApiResponse<T>>(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async uploadFile<T>(
    endpoint: string,
    fileUri: string,
    onUploadProgress?: (event: AxiosProgressEvent) => void,
    cancelToken?: CancelToken,
    timeout?: number
  ): Promise<ApiResponse<T>> {
    try {
      // extract filename from uri
      const filename = fileUri.split("/").pop() ?? "upload.jpg";

      // detect file extension
      const ext = filename.split(".").pop()?.toLowerCase();

      // basic mime detection
      let type = "image/jpeg";
      if (ext === "png") type = "image/png";
      else if (ext === "jpg" || ext === "jpeg") type = "image/jpeg";
      else if (ext === "gif") type = "image/gif";

      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        type,
        name: filename,
      }as any);

      const response = await this.axiosInstance.post<ApiResponse<T>>(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
        cancelToken,
        timeout: timeout ?? API_CONFIG.TIMEOUT,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

}

export const apiClient = new ApiClient();