import {
  ApiResponse,
  User,
  LoginRequest,
  AuthResponse,
  UserRequest,
  FarmerRequest,
  SupplierRequest,
  BuyerRequest,
  Buyer,
  Supplier,
  Farmer,
  GoogleAuthRequest,
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

  async registerFarmer(userData: FarmerRequest): Promise<ApiResponse<Farmer>> {
    const response = await apiClient.post<ApiResponse<Farmer>>(API_ENDPOINTS.AUTH.REGISTER_FARMER, userData);
    return response;
  }

  async registerSupplier(userData: SupplierRequest): Promise<ApiResponse<Supplier>> {
    const response = await apiClient.post<ApiResponse<Supplier>>(API_ENDPOINTS.AUTH.REGISTER_SUPPLIER, userData);
    return response;
  }

  async registerBuyer(userData: BuyerRequest): Promise<ApiResponse<Buyer>> {
    const response = await apiClient.post<ApiResponse<Buyer>>(API_ENDPOINTS.AUTH.REGISTER_BUYER, userData);
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

  async verifyOtp(data: string): Promise<ApiResponse<User>> {
    const response = await apiClient.post<ApiResponse<User>>(API_ENDPOINTS.AUTH.CHECK_OTP, data);
    return response;
  }

  async askOtpCode(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ASK_OTP_CODE);
    return response;
  }

  /**
   * Request password reset with email
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }, { timeout: 20000 });
    return response;
  }

  /**
   * Verify reset code with email
   */
  async verifyResetCode(email: string, code: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.CHECK_RESET_CODE, { email, code });
    return response;
  }

  /**
   * Reset password with email, reset code, and new password
   */
  async resetPassword(email: string, resetCode: string, newPassword: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      email,
      resetCode,
      newPassword
    });
    return response;
  }
}

export const authService = new AuthService();
