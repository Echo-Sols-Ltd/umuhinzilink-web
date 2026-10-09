import { District, User } from './user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AskOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  code: string;
}

export interface GoogleAuthRequest {
  token: string;
  role?: string;
}

export interface ResetPasswordRequest {
  code: string;
  newPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}