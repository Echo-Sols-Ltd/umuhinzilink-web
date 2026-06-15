import {
  ApiResponse,
  User,
  LoginRequest,
  AuthResponse,
  UserRequest,
  Seller,
  SellerRegistration,
  GoogleAuthRequest,
  VerifyOtpRequest,
  RefreshTokenRequest,
  ResetPasswordRequest,
  ForgotPasswordRequest
} from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

/**
 * Service for authentication-related API calls and local storage management.
 */
class AuthService {
  /**
   * Log in a user and store tokens.
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response;
  }

  async googleLogin(data: string): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, { token: data })
    return response
  }

  /**
   * Sign up a new user and store tokens.
   */
  async registerGoogleUser(data: GoogleAuthRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.REGISTER_GOOGLE_USER, data);
    return response
  }

  async register(userData: UserRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response;
  }

  async registerSeller(userData: SellerRegistration): Promise<ApiResponse<User>> {
    const response = await apiClient.post<ApiResponse<User>>(API_ENDPOINTS.AUTH.REGISTER_SELLER, userData);
    return response;
  }


  /**
   * Verify logged in user
   */
  async checkToken(): Promise<ApiResponse<User>> {
    return await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.VERIFY_USER);
  }

  async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<AuthResponse>> {
    return await apiClient.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.REFRESH, data);
  }

  /**
   * Log out the user and clear tokens.
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      const response = await apiClient.post<ApiResponse<void>>(
        API_ENDPOINTS.AUTH.LOGOUT,
        refreshToken ? { refreshToken } : undefined
      );
      localStorage.clear();
      return response;
    } catch (error) {
      localStorage.clear();
      throw error;
    }
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
    return response;
  }

  async askOtpCode(): Promise<ApiResponse<string>> {
    const response = await apiClient.post<ApiResponse<string>>(API_ENDPOINTS.AUTH.ASK_OTP_CODE);
    return response;
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    return response;
  }


  /**
   * Reset password with email, reset code, and new password
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data)
    return response;
  }

  /**
   * Check if the reset code is valid
   */
  async checkResetCode(data: string): Promise<ApiResponse<boolean>> {
    const response = await apiClient.post<ApiResponse<boolean>>(API_ENDPOINTS.AUTH.CHECK_RESET_CODE, { code: data })
    return response;
  }
}

export const authService = new AuthService();
