'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  SellerRegistration,
  LoginRequest,
  User,
  UserRequest,
  Seller,
  GoogleAuthRequest,
  UserRole,
  VerifyOtpRequest,
} from '@/types';
import { authService } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { notify } from '@/lib/notify';
import { apiClient } from '@/services/client';
import { socketService } from '@/services/socket';
import { userService } from '@/services/users';
import { HTTP_STATUS } from '@/services/constants';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  SELLER: 'seller',
  BUYER: 'buyer',
} as const;

interface AuthContextType {
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>;
  googleLogin: (data: string) => Promise<void>
  googleToken: string | null
  setGoogleToken: (data: string) => void
  loading: boolean;
  loadAuthState: () => Promise<void>;
  user: User | null;
  seller: Seller | null;
  logout: () => Promise<void>;
  registerGoogle: (data: GoogleAuthRequest) => Promise<void>
  register: (data: UserRequest) => Promise<string | null>;
  registerSeller: (data: SellerRegistration) => Promise<void>;
  verifyOtp: (data: VerifyOtpRequest) => Promise<void>;
  askOtpCode: () => Promise<void>;
  updateAvatar: (data: string) => Promise<void>;
  updateSavedProducts: (productIds: string[]) => Promise<boolean>;
  toggleSavedProduct: (productId: string) => Promise<boolean>;
  isProductSaved: (productId: string) => boolean;
  setUserState: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [googleToken, setGoogleToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    const handleLogout = () => {
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
      socketService.logout();
      setUser(null);
      setSeller(null);
      setIsAuthenticated(false);
      setLoading(false);
      router.push('/auth/signin');
    };

    apiClient.onLogout(handleLogout);
    socketService.onLogout(handleLogout);
    return () => {
      apiClient.removeLogoutListener(handleLogout);
      socketService.removeLogoutListener(handleLogout);
    };
  }, [router]);

  const fetchSeller = async () => {
    try {
      const res = await userService.getSellerMe();
      if (!res.success || !res.data) return;
      localStorage.setItem(STORAGE_KEYS.SELLER, JSON.stringify(res.data));
      setSeller(res.data);
    } catch {
      notify.error('Please try again later', 'Fetching seller failed');
    }
  };

  const getStoredData = <T,>(key: string): T | null => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  const normalizeUser = (nextUser: User): User => ({
    ...nextUser,
    savedProducts: nextUser.savedProducts ?? [],
  });

  const persistSession = (token: string, refreshToken: string | undefined, nextUser: User) => {
    const normalized = normalizeUser(nextUser);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalized));
    setUser(normalized);
  };

  const loadAuthState = async () => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    try {
      setLoading(true);
      const storedUser = getStoredData<User>(STORAGE_KEYS.USER);

      if (!token || !storedUser) {
        setIsAuthenticated(false);
        return;
      }

      const res = await authService.checkToken();
      if (!res.success || !res.data) {
        Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
        setUser(null);
        setSeller(null);
        setIsAuthenticated(false);
        return;
      }

      const existingRefresh = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ?? undefined;
      persistSession(token, existingRefresh, res.data);

      if (!res.data.emailVerified) {
        setIsAuthenticated(false);
        router.replace('/auth/verify-otp');
        return;
      }

      setIsAuthenticated(true);
      if (res.data.role === UserRole.SELLER) {
        await fetchSeller();
      }
    } catch (err) {
      const isAuthFailure =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        (err as { response?: { status?: number } }).response?.status === HTTP_STATUS.UNAUTHORIZED;

      if (isAuthFailure) {
        Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
        setUser(null);
        setSeller(null);
        setIsAuthenticated(false);
        return;
      }

      // Transient failure: keep cached session so the user isn't kicked out on a blip
      const storedUser = getStoredData<User>(STORAGE_KEYS.USER);
      if (token && storedUser) {
        setUser(storedUser);
        setIsAuthenticated(Boolean(storedUser.emailVerified));
        notify.error('Could not verify session. Showing cached data — refresh or try again.', 'Connection issue');
      } else {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginRequest) => {
    try {
      setLoading(true);
      const res = await authService.login(data);

      if (!res.success || !res.data) {
        notify.error(res.message || 'Login failed', 'Login Failed');
        return;
      }

      persistSession(res.data.token, res.data.refreshToken, res.data.user);

      if (!res.data.user.emailVerified) {
        setIsAuthenticated(false);
        await askOtpCode();
        router.replace('/auth/verify-otp');
        return;
      }

      setIsAuthenticated(true);
      if (res.data.user.role === UserRole.SELLER) {
        await fetchSeller();
      }
      router.replace('/');
    } catch {
      notify.error('Please try again', 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (token: string) => {
    try {
      setLoading(true);
      const res = await authService.googleLogin(token);

      if (!res.success || !res.data) {
        notify.error(res.message || 'Login failed', 'Login Failed');
        return;
      }

      persistSession(res.data.token, res.data.refreshToken, res.data.user);
      setIsAuthenticated(true);

      if (res.data.user.role === UserRole.SELLER) {
        await fetchSeller();
      }

      router.replace('/');
    } catch {
      notify.error('Please try again', 'Error logging in');
    } finally {
      setLoading(false);
      setGoogleToken(null)
    }
  }

  const registerGoogle = async (data: GoogleAuthRequest) => {
    try {
      setLoading(true);
      const res = await authService.registerGoogleUser({
        ...data,
        role: data.role ?? UserRole.BUYER,
      });

      if (!res.success || !res.data) {
        notify.error(res.message || 'Registration failed', 'Register Failed');
        return;
      }

      persistSession(res.data.token, res.data.refreshToken, res.data.user);
      setIsAuthenticated(true);
      notify.success('Account created successfully', 'Register Success');
      router.replace('/');
    } catch {
      notify.error('Please try again', 'Error registering');
    } finally {
      setLoading(false);
      setGoogleToken(null)
    }
  }

  const register = async (data: UserRequest): Promise<string | null> => {
    try {
      setLoading(true);
      const res = await authService.register(data);

      if (!res.success || !res.data) {
        const message = res.message || 'Registration failed';
        notify.error(message, 'Register Failed');
        return message;
      }

      persistSession(res.data.token, res.data.refreshToken, res.data.user);
      setIsAuthenticated(false);
      notify.success('Check your email for the verification code', 'Register Success');
      router.replace('/auth/verify-otp');
      return null;
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      const fallback = message || 'Please try again';
      notify.error(fallback, 'Error registering');
      return fallback;
    } finally {
      setLoading(false);
    }
  };

  const registerSeller = async (data: SellerRegistration) => {
    try {
      setLoading(true);
      const res = await authService.registerSeller(data);

      if (!res.success || !res.data) {
        notify.error(res.message || 'Registration failed', 'Register Failed');
        return;
      }

      persistSession(res.data.token, res.data.refreshToken, res.data.user);
      setIsAuthenticated(true);
      await fetchSeller();
      notify.success('Seller profile created successfully', 'Register Success');
    } catch {
      notify.error('Please try again', 'Error registering seller');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (data: VerifyOtpRequest) => {
    try {
      setLoading(true);
      const res = await authService.verifyOtp(data);

      if (!res.success || !res.data) {
        notify.error(res.message || 'Invalid or expired code', 'Verify Failed');
        return;
      }

      persistSession(res.data.token, res.data.refreshToken, res.data.user);
      setIsAuthenticated(true);
      notify.success('Email verified successfully', 'Verify Success');
      router.replace('/');
    } catch {
      notify.error('Please try again', 'Error verifying');
    } finally {
      setLoading(false);
    }
  };

  const askOtpCode = async () => {
    try {
      setLoading(true);
      const res = await authService.askOtpCode();

      if (!res.success) {
        notify.error(res.message || 'Failed to send code', 'Ask OTP Failed');
        return;
      }
      notify.success('A new verification code has been sent to your email', 'OTP sent');
    } catch {
      notify.error('Please try again', 'Error asking for OTP');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // still clear local session
    } finally {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
      await socketService.logout();
      setUser(null);
      setSeller(null);
      setIsAuthenticated(false);
      router.replace('/auth/signin');
    }
  };

  const updateAvatar = async (avatarUrl: string) => {
    if (!user) return;
    const updatedUser = { ...user, profilePicture: avatarUrl };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  };

  const setUserState = (nextUser: User) => {
    const normalized = normalizeUser(nextUser);
    setUser(normalized);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalized));
  };

  const updateSavedProducts = async (productIds: string[]): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await userService.updateProfile(user.id, { savedProducts: productIds });
      if (!res.success || !res.data) {
        notify.error(res.message || 'Could not update saved products');
        return false;
      }
      setUserState(res.data);
      return true;
    } catch {
      notify.error('Could not update saved products');
      return false;
    }
  };

  const isProductSaved = (productId: string): boolean =>
    user?.savedProducts?.includes(productId) ?? false;

  const toggleSavedProduct = async (productId: string): Promise<boolean> => {
    if (!user) return false;
    const current = user.savedProducts ?? [];
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    return updateSavedProducts(next);
  };

  useEffect(() => {
    loadAuthState();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        googleToken,
        setGoogleToken,
        login,
        googleLogin,
        loadAuthState,
        user,
        seller,
        logout,
        register,
        registerGoogle,
        registerSeller,
        verifyOtp,
        askOtpCode,
        updateAvatar,
        updateSavedProducts,
        toggleSavedProduct,
        isProductSaved,
        setUserState,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { useAuth, AuthProvider };
