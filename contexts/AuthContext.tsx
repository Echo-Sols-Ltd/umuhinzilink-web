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
  AskOtpRequest
} from '@/types';
import { authService } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { notify } from '@/lib/notify';
import { apiClient } from '@/services/client';
import { userService } from '@/services/users';

// Storage keys for localStorage
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
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
  register: (data: UserRequest) => Promise<void>;
  registerSeller: (data: SellerRegistration) => Promise<void>;
  verifyOtp: (data: VerifyOtpRequest) => Promise<void>;
  askOtpCode: (data: AskOtpRequest) => Promise<void>;
  updateAvatar: (data: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to access auth context
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
    // Register logout listener to handle token expiry and unauthorized access
    const handleLogout = () => {
      // Clear all auth state
      setUser(null);
      setSeller(null);
      setLoading(false);

      // Redirect to login page
      router.push('/');
    };

    // Register the logout callback with apiClient
    apiClient.onLogout(handleLogout);

    // Cleanup function to remove the listener when component unmounts
    return () => {
      apiClient.removeLogoutListener(handleLogout);
    };
  }, [router]);

  // Fetch seller profile from API and store in state/localStorage
  const fetchSeller = async () => {
    try {
      const res = await userService.getSellerMe();
      if (!res.success) {
        router.replace('/auth/seller');
        return;
      }
      if (res.data) {
        localStorage.setItem(STORAGE_KEYS.SELLER, JSON.stringify(res.data));
        setSeller(res.data);
      }
    } catch {
      notify.error('Please try again later', 'Fetching seller failed');
    }
  };



  // Retrieve user data from localStorage
  const getStoredData = <T,>(key: string): T | null => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  // Load authentication state from localStorage and validate user
  const loadAuthState = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const user = getStoredData<User>(STORAGE_KEYS.USER);

      if (!token || !user) {
        setLoading(false);
        setIsAuthenticated(false)
        return;
      }

      setUser(user);

      // Redirect to OTP verification if user is not verified
      if (!user.emailVerified) {
        setIsAuthenticated(false)
        router.replace('/auth/verify-otp');
        setLoading(false);

        return;
      }

      setIsAuthenticated(true)
      setLoading(false);
    } catch {
      notify.error('Please try again later', 'Loading auth state failed');
      setLoading(false);
    } finally {
      setLoading(false)
    }
  };

  // Authenticate user with credentials
  const login = async (data: LoginRequest) => {
    try {
      setLoading(true);
      const res = await authService.login(data);

      if (!res.success) {
        notify.error(res.message, 'Login Failed');
        return;
      }

      if (res.data) {
        // Store auth token and user data
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data.user));
        setUser(res.data.user);
        if (!res.data.user.emailVerified) {
          await askOtpCode({ email: res.data.user.email });
          router.replace('/auth/verify-otp');
          setLoading(false);
          return;
        }

        router.replace('/');
      }
    } catch {
      notify.error('Please try again', 'Error logging in');
    } finally {
      setLoading(false);

    }
  };

  const googleLogin = async (token: string) => {
    try {
      setLoading(true);
      console.log(token)
      const res = await authService.googleLogin(token);

      if (!res.success) {
        notify.error(res.message, 'Login Failed');
        return;
      }

      if (res.data) {
        // Store auth token and user data
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data.user));
        setUser(res.data.user);

        // Fetch role-specific profile data
        const roleFetchers = {
          [UserRole.SELLER]: fetchSeller,
        };

        const fetcher = roleFetchers[res.data.user.role as keyof typeof roleFetchers];
        if (fetcher) await fetcher();

        router.replace('/');
      }
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
      const res = await authService.registerGoogleUser(data);

      if (!res.success) {
        notify.error(res.message, 'Register Failed');
        return;
      }

      if (res.data) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data.user));
        setUser(res.data.user);
        notify.success('Register Success', 'User registered successfully');
        await loadAuthState();
      }
    } catch {
      notify.error('Please try again', 'Error registering');
    } finally {
      setLoading(false);
      setGoogleToken(null)
    }
  }

  // Register new user account
  const register = async (data: UserRequest) => {
    try {
      setLoading(true);
      const res = await authService.register(data);

      if (!res.success) {
        notify.error(res.message, 'Register Failed');
        return;
      }

      if (res.data) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data.user));
        setUser(res.data.user);
        notify.success('Register Success', 'User registered successfully');
        await loadAuthState();
      }
    } catch {
      notify.error('Please try again', 'Error registering');
    } finally {
      setLoading(false);
    }
  };


  // Register seller profile
  const registerSeller = async (data: SellerRegistration) => {
    try {
      setLoading(true);
      const res = await authService.registerSeller(data);

      if (!res.success) {
        notify.error(res.message, 'Register Failed');
        return;
      }

      if (res.data) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data));
        setUser(res.data);
        notify.success('Register Success', 'Seller registered successfully');
      }
    } catch {
      notify.error('Please try again', 'Error registering seller');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP code for account verification
  const verifyOtp = async (data: VerifyOtpRequest) => {
    try {
      setLoading(true);
      const res = await authService.verifyOtp(data);

      if (!res.success) {
        notify.error(res.message, 'Verify Failed');
        return;
      }

      if (res.data) {
        const user = res.data.user;
        const token = res.data.token;

        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        setUser(user);
        notify.success('Verify Success', 'User verified successfully');
        await loadAuthState();
        router.replace('/');
      }
    } catch {
      notify.error('Please try again', 'Error verifying');
    } finally {
      setLoading(false);
    }
  };

  // Request OTP code to be sent to user
  const askOtpCode = async (data: AskOtpRequest) => {
    try {
      setLoading(true);
      const res = await authService.askOtpCode(data);

      if (!res.success) {
        notify.error(res.message, 'Ask OTP Failed');
      }
      notify.success('Ask OTP Success', 'OTP sent successfully');
    } catch {
      notify.error('Please try again', 'Error asking for OTP');
    } finally {
      setLoading(false);
    }
  };

  // Clear all auth data and redirect to home
  const logout = async () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    localStorage.clear();

    setUser(null);
    setSeller(null);
    setIsAuthenticated(false)
    router.replace('/');
  };

  // Update user avatar URL
  const updateAvatar = async (avatarUrl: string) => {
    if (!user) return;

    const updatedUser = { ...user, avatar: avatarUrl };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  };

  // Load auth state on component mount
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
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { useAuth, AuthProvider };
