import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  BuyerRequest,
  FarmerRequest,
  LoginRequest,
  SupplierRequest,
  User,
  UserRequest,
  Farmer,
  Supplier,
  Buyer,
  GoogleAuthRequest,
} from '@/types';
import { UserType } from '@/types';
import { authService } from '@/services/auth';
import { farmerService } from '@/services/farmers';
import { buyerService } from '@/services/buyers';
import { supplierService } from '@/services/suppliers';
import { useRouter } from 'next/navigation';
import { notify } from '@/lib/notify';
import { apiClient } from '@/services/client';

// Storage keys for localStorage
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  FARMER: 'farmer',
  SUPPLIER: 'supplier',
  BUYER: 'buyer',
} as const;

interface AuthContextType {
  login: (data: LoginRequest) => Promise<void>;
  googleLogin: (data: string) => Promise<void>
  googleToken: string | null
  loading: boolean;
  loadAuthState: () => Promise<void>;
  user: User | null;
  farmer: Farmer | null;
  supplier: Supplier | null;
  buyer: Buyer | null;
  logout: () => Promise<void>;
  registerGoogle: (data: GoogleAuthRequest) => Promise<void>
  register: (data: UserRequest) => Promise<void>;
  registerBuyer: (data: BuyerRequest) => Promise<void>;
  registerSupplier: (data: SupplierRequest) => Promise<void>;
  registerFarmer: (data: FarmerRequest) => Promise<void>;
  verifyOtp: (data: string) => Promise<void>;
  askOtpCode: () => Promise<void>;
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
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [buyer, setBuyer] = useState<Buyer | null>(null);

  useEffect(() => {
    // Register logout listener to handle token expiry and unauthorized access
    const handleLogout = () => {
      // Clear all auth state
      setUser(null);
      setFarmer(null);
      setSupplier(null);
      setBuyer(null);
      setLoading(false);

      // Redirect to login page
      router.push('/auth/signin');
    };

    // Register the logout callback with apiClient
    apiClient.onLogout(handleLogout);

    // Cleanup function to remove the listener when component unmounts
    return () => {
      apiClient.removeLogoutListener(handleLogout);
    };
  }, [router]);

  // Fetch farmer profile from API and store in state/localStorage
  const fetchFarmer = async () => {
    try {
      const res = await farmerService.getMe();
      if (!res.success) {
        router.replace('/auth/farmer');
        return;
      }
      if (res.data) {
        localStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(res.data));
        setFarmer(res.data);
      }
    } catch {
      notify.error('Please try again later', 'Fetching farmer failed');
    }
  };

  // Fetch buyer profile from API and store in state/localStorage
  const fetchBuyer = async () => {
    try {
      const res = await buyerService.getMe();
      if (!res.success) {
        router.replace('/auth/buyer');
        return;
      }
      if (res.data) {
        localStorage.setItem(STORAGE_KEYS.BUYER, JSON.stringify(res.data));
        setBuyer(res.data);
      }
    } catch {
      notify.error('Please try again later', 'Fetching buyer failed');
    }
  };

  // Fetch supplier profile from API and store in state/localStorage
  const fetchSupplier = async () => {
    try {
      const res = await supplierService.getMe();
      if (!res.success) {
        router.replace('/auth/supplier');
        return;
      }
      if (res.data) {
        localStorage.setItem(STORAGE_KEYS.SUPPLIER, JSON.stringify(res.data));
        setSupplier(res.data);
      }
    } catch {
      notify.error('Please try again later', 'Fetching supplier failed');
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
        return;
      }

      setUser(user);

      // Redirect to OTP verification if user is not verified
      if (!user.verified) {
        await askOtpCode();
        router.replace('/auth/verify-otp');
        setLoading(false);
        return;
      }

      // Load role-specific data based on user type
      if (user.role === UserType.BUYER) {
        const buyerData = getStoredData<Buyer>(STORAGE_KEYS.BUYER);
        if (!buyerData) {
          router.replace('/auth/buyer');
          setLoading(false);
          return;
        }
        setBuyer(buyerData);
      } else if (user.role === UserType.FARMER) {
        const farmerData = getStoredData<Farmer>(STORAGE_KEYS.FARMER);
        if (!farmerData) {
          router.replace('/auth/farmer');
          setLoading(false);
          return;
        }
        setFarmer(farmerData);
      } else if (user.role === UserType.SUPPLIER) {
        const supplierData = getStoredData<Supplier>(STORAGE_KEYS.SUPPLIER);
        if (!supplierData) {
          router.replace('/auth/supplier');
          setLoading(false);
          return;
        }
        setSupplier(supplierData);
      }

      setLoading(false);
    } catch {
      notify.error('Please try again later', 'Loading auth state failed');
      setLoading(false);
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

        // Fetch role-specific profile data
        const roleFetchers = {
          [UserType.BUYER]: fetchBuyer,
          [UserType.FARMER]: fetchFarmer,
          [UserType.SUPPLIER]: fetchSupplier,
        };

        const fetcher = roleFetchers[res.data.user.role as keyof typeof roleFetchers];
        if (fetcher) await fetcher();

        // Navigate to role-specific dashboard
        const dashboardRoutes = {
          [UserType.ADMIN]: '/admin/dashboard',
          [UserType.FARMER]: '/farmer/dashboard',
          [UserType.BUYER]: '/buyer/dashboard',
          [UserType.SUPPLIER]: '/supplier/dashboard',
        };

        const route = dashboardRoutes[res.data.user.role as keyof typeof dashboardRoutes];
        if (route) router.replace(route);
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
          [UserType.BUYER]: fetchBuyer,
          [UserType.FARMER]: fetchFarmer,
          [UserType.SUPPLIER]: fetchSupplier,
        };

        const fetcher = roleFetchers[res.data.user.role as keyof typeof roleFetchers];
        if (fetcher) await fetcher();

        // Navigate to role-specific dashboard
        const dashboardRoutes = {
          [UserType.ADMIN]: '/admin/dashboard',
          [UserType.FARMER]: '/farmer/dashboard',
          [UserType.BUYER]: '/buyer/dashboard',
          [UserType.SUPPLIER]: '/supplier/dashboard',
        };

        const route = dashboardRoutes[res.data.user.role as keyof typeof dashboardRoutes];
        if (route) router.replace(route);
      }
    } catch {
      notify.error('Please try again', 'Error logging in');
    } finally {
      setLoading(false);
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
        await loadAuthState();
      }
    } catch {
      notify.error('Please try again', 'Error registering');
    } finally {
      setLoading(false);
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
        await loadAuthState();
      }
    } catch {
      notify.error('Please try again', 'Error registering');
    } finally {
      setLoading(false);
    }
  };

  // Register buyer profile
  const registerBuyer = async (data: BuyerRequest) => {
    try {
      setLoading(true);
      const res = await authService.registerBuyer(data);

      if (!res.success) {
        notify.error(res.message, 'Register Failed');
        return;
      }

      if (res.data) {
        localStorage.setItem(STORAGE_KEYS.BUYER, JSON.stringify(res.data));
        setBuyer(res.data);
        router.replace('/');
      }
    } catch {
      notify.error('Please try again', 'Error registering buyer');
    } finally {
      setLoading(false);
    }
  };

  // Register supplier profile
  const registerSupplier = async (data: SupplierRequest) => {
    try {
      setLoading(true);
      const res = await authService.registerSupplier(data);

      if (!res.success) {
        notify.error(res.message, 'Register Failed');
        return;
      }

      if (res.data) {
        localStorage.setItem(STORAGE_KEYS.SUPPLIER, JSON.stringify(res.data));
        setSupplier(res.data);
        router.replace('/');
      }
    } catch {
      notify.error('Please try again', 'Error registering supplier');
    } finally {
      setLoading(false);
    }
  };

  // Register farmer profile
  const registerFarmer = async (data: FarmerRequest) => {
    try {
      setLoading(true);
      const res = await authService.registerFarmer(data);

      if (!res.success) {
        notify.error(res.message, 'Register Failed');
        return;
      }

      if (res.data) {
        localStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(res.data));
        setFarmer(res.data);
        router.replace('/');
      }
    } catch {
      notify.error('Please try again', 'Error registering farmer');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP code for account verification
  const verifyOtp = async (data: string) => {
    try {
      setLoading(true);
      const res = await authService.verifyOtp(data);

      if (!res.success) {
        notify.error(res.message, 'Verify Failed');
        return;
      }

      if (res.data && user) {
        const updatedUser = { ...user, verified: true };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        setUser(updatedUser);
        await loadAuthState();
      }
    } catch {
      notify.error('Please try again', 'Error verifying');
    } finally {
      setLoading(false);
    }
  };

  // Request OTP code to be sent to user
  const askOtpCode = async () => {
    try {
      setLoading(true);
      const res = await authService.askOtpCode();

      if (!res.success) {
        notify.error(res.message, 'Ask OTP Failed');
      }
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
    setFarmer(null);
    setSupplier(null);
    setBuyer(null);

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
        login,
        googleLogin,
        loadAuthState,
        user,
        farmer,
        supplier,
        buyer,
        logout,
        register,
        registerGoogle,
        registerBuyer,
        registerSupplier,
        registerFarmer,
        verifyOtp,
        askOtpCode,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { useAuth, AuthProvider };
