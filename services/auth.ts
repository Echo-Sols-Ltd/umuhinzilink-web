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
  AskOtpRequest,
  ResetPasswordRequest
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

  async registerSeller(userData: SellerRegistration): Promise<ApiResponse<Seller>> {
    const response = await apiClient.post<ApiResponse<Seller>>(API_ENDPOINTS.AUTH.REGISTER_SELLER, userData);
    return response;
  }


  /**
   * Verify logged in user
   */
  async checkToken(): Promise<ApiResponse<User>> {
    return await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.VERIFY_USER);
  }

  /**
   * Log out the user and clear tokens.
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.LOGOUT);
      localStorage.clear();
      return response;
    } catch (error) {
      localStorage.clear();
      throw error;
    }
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse<User>> {
    const response = await apiClient.post<ApiResponse<User>>(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
    return response;
  }

  async askOtpCode(data: AskOtpRequest): Promise<ApiResponse<User>> {
    const response = await apiClient.post<ApiResponse<User>>(API_ENDPOINTS.AUTH.ASK_OTP_CODE, data);
    return response;
  }



  /**
   * Reset password with email, reset code, and new password
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data)
    return response;
  }
}

export const authService = new AuthService();
