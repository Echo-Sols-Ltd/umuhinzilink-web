import { District, User } from './user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
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
}

export interface ResetPasswordRequest {
  newPassword: string
}