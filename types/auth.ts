import { User } from './user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}


export interface GoogleAuthRequest {
  token: string;
  role: string;
}