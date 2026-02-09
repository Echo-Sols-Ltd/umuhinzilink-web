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
} from '@/types';
import { UserType } from '@/types/enums';
import { authService } from '@/services/auth';
import { farmerService } from '@/services/farmers';
import { buyerService } from '@/services/buyers';
import { supplierService } from '@/services/suppliers';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  login: (data: LoginRequest) => Promise<void>;
  loading: boolean;
  loadAuthState: () => Promise<void>;
  user: User | null;
  farmer: Farmer | null;
  supplier: Supplier | null;
  buyer: Buyer | null;
  logout: () => Promise<void>;
  register: (data: UserRequest) => Promise<void>;
  registerBuyer: (data: BuyerRequest) => Promise<void>;
  registerSupplier: (data: SupplierRequest) => Promise<void>;
  registerFarmer: (data: FarmerRequest) => Promise<void>;
  verifyOtp: (data: string) => Promise<void>;
  askOtpCode: () => Promise<void>;
  updateAvatar: (data: string) => Promise<void>;
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
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const { toast } = useToast()

  const fetchFarmer = async () => {
    try {
      const res = await farmerService.getMe();
      if (!res.success) {
        router.replace('/auth/farmer');
        return
      }
      if (res.data) {
        localStorage.setItem('farmer', JSON.stringify(res.data));
        setFarmer(res.data);
      }
    } catch {
      toast({
        title: 'Fetching farmer failed',
        description: 'Please try again later',
        variant: 'error',
      });
    }
  };

  const fetchBuyer = async () => {
    try {
      const res = await buyerService.getMe();
      if (!res.success) {
        router.replace('/auth/buyer');
        return
      }
      if (res.data) {
        localStorage.setItem('buyer', JSON.stringify(res.data));
        setBuyer(res.data);
      }
    } catch {
      toast({
        title: 'Fetching buyer failed',
        description: 'Please try again later',
        variant: 'error',
      });
    }
  };

  const fetchSupplier = async () => {
    try {
      const res = await supplierService.getMe();
      if (!res.success) {
        router.replace('/auth/supplier');
        return
      }
      if (res.data) {
        localStorage.setItem('supplier', JSON.stringify(res.data));
        setSupplier(res.data);
      }
    } catch {
      toast({
        title: 'Fetching supplier failed',
        description: 'Please try again later',
        variant: 'error',
      });
    }
  };

  const getUser = () => {
    const stringUser = localStorage.getItem('user');

    if (!stringUser) return null;
    const user: User = JSON.parse(stringUser);
    return user;
  };

  const getFarmer = () => {
    const stringUser = localStorage.getItem('farmer');
    if (!stringUser) return null;

    const user: Farmer = JSON.parse(stringUser);
    return user;
  };

  const getBuyer = () => {
    const stringUser = localStorage.getItem('buyer');
    if (!stringUser) return null;
    const user: Buyer = JSON.parse(stringUser);
    return user;
  };

  const getSupplier = () => {
    const stringUser = localStorage.getItem('supplier');
    if (!stringUser) return null;
    const user: Supplier = JSON.parse(stringUser);
    return user;
  };

  const loadAuthState = async () => {
    try {
      // localStorage.removeItem('auth_token')
      setLoading(true)
      const token = localStorage.getItem('auth_token');
      const user = getUser();
      const farmer = getFarmer();
      const supplier = getSupplier();
      const buyer = getBuyer();
      if (token && user) {
        setUser(user);
        if (!user.verified) {
          await askOtpCode()
          router.replace('/auth/verify-otp')
          return
        }
        if (user.role === UserType.BUYER) {
          if (!buyer) {
            router.replace('/auth/buyer')
            setLoading(false)
            return
          }
          setBuyer(buyer);
        }
        if (user.role === UserType.FARMER) {
          if (!farmer || !user.verified) {
            router.replace('/auth/farmer')
            setLoading(false)
            return
          }
          setFarmer(farmer);
        }
        if (user.role === UserType.SUPPLIER) {
          if (!supplier || !user.verified) {
            router.replace('/auth/supplier')
            setLoading(false)
            return
          }
          setSupplier(supplier);
        }
        setLoading(false)
        return;
      }
      setLoading(false)
    } catch {
      toast({
        title: 'Loading auth state failed',
        description: 'Please try again later',
        variant: 'error',
      });
    }
  };

  const login = async (data: LoginRequest) => {
    try {
      setLoading(true);
      const res = await authService.login(data);
      if (!res.success) {
        toast({
          title: 'Login Failed',
          description: res.message,
          variant: 'error',
        });
      }
      console.log(res)
      if (res.success && res.data) {
        localStorage.setItem('auth_token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);

        if (res.data.user.role === UserType.BUYER) {
          await fetchBuyer();
        }
        if (res.data.user.role === UserType.FARMER) {
          await fetchFarmer();
        }
        if (res.data.user.role === UserType.SUPPLIER) {
          await fetchSupplier();
        }

        if (res.data.user.role === UserType.ADMIN) router.replace('/admin/dashboard');
        else if (res.data.user.role === UserType.FARMER) router.replace('/farmer/dashboard');
        else if (res.data.user.role === UserType.BUYER) router.replace('/buyer/dashboard');
        else if (res.data.user.role === UserType.SUPPLIER) router.replace('/supplier/dashboard');
      }
    } catch {
      toast({
        title: 'Error logging in',
        description: 'Please try again',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: UserRequest) => {
    try {
      setLoading(true);

      const res = await authService.register(data);
      if (!res.success) {
        toast({
          title: 'Register Failed',
          description: res.message,
          variant: 'error',
        });
      }

      if (res.success && res.data) {
        localStorage.setItem('auth_token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        loadAuthState()
      }
    } catch {
      toast({
        title: 'Error registering',
        description: 'Please try again',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const registerBuyer = async (data: BuyerRequest) => {
    try {
      setLoading(true);
      const res = await authService.registerBuyer(data);
      if (!res.success) {
        toast({
          title: 'Register Failed',
          description: res.message,
          variant: 'error',
        });
      }
      if (res.success && res.data) {
        localStorage.setItem('buyer', JSON.stringify(res.data));
        setBuyer(res.data);
        router.replace('/');
      }
    } catch {
      toast({
        title: 'Error registering buyer',
        description: 'Please try again',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const registerSupplier = async (data: SupplierRequest) => {
    try {
      setLoading(true);
      const res = await authService.registerSupplier(data);
      if (!res.success) {
        toast({
          title: 'Register Failed',
          description: res.message,
          variant: 'error',
        });
      }
      if (res.success && res.data) {
        localStorage.setItem('supplier', JSON.stringify(res.data));
        setSupplier(res.data);
        router.replace('/');
      }
    } catch {
      toast({
        title: 'Error registering supplier',
        description: 'Please try again',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const registerFarmer = async (data: FarmerRequest) => {
    try {
      setLoading(true);
      const res = await authService.registerFarmer(data);
      if (!res.success) {
        toast({
          title: 'Register Failed',
          description: res.message,
          variant: 'error',
        });
      }
      if (res.success && res.data) {
        localStorage.setItem('farmer', JSON.stringify(res.data));
        setFarmer(res.data);
        router.replace('/');
      }
    } catch {
      toast({
        title: 'Error registering farmer',
        description: 'Please try again',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (data: string) => {
    try {
      setLoading(true);
      const res = await authService.verifyOtp(data);
      if (!res.success) {
        toast({
          title: 'Verify Failed',
          description: res.message,
          variant: 'error',
        });
      }
      if (res.success && res.data && user) {
        user.verified = true;
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        await loadAuthState()
      }
    } catch {
      toast({
        title: 'Error verifying',
        description: 'Please try again',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const askOtpCode = async () => {
    try {
      setLoading(true);
      const res = await authService.askOtpCode();
      if (!res.success) {
        toast({
          title: 'Ask OTP Failed',
          description: res.message,
          variant: 'error',
        });
      }
    } catch {
      toast({
        title: 'Error asking for OTP',
        description: 'Please try again',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('farmer');
    localStorage.removeItem('supplier');
    localStorage.removeItem('buyer');
    localStorage.clear();
    setUser(null);
    setFarmer(null);
    setSupplier(null);
    setBuyer(null);

    router.replace('/');
  };

  const updateAvatar = async (data: string) => {
    setUser(prev => {
      if (!prev) return null;
      prev.avatar = data;
      return prev;
    });
    localStorage.setItem('user', JSON.stringify(user));
  };


  useEffect(() => {
    loadAuthState();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        login,
        loadAuthState,
        user,
        farmer,
        supplier,
        buyer,
        logout,
        register,
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
