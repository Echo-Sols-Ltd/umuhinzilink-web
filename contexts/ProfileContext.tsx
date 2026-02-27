import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Farmer, Supplier, Buyer } from '@/types/user';
import { UserType } from '@/types/enums';
import { useAuth } from './AuthContext';
import { userService } from '@/services/users';
import { farmerService } from '@/services/farmers';
import { supplierService } from '@/services/suppliers';
import { buyerService } from '@/services/buyers';

interface ProfileContextValue {
  // Profile data
  profile: User | Farmer | Supplier | Buyer | null;
  loading: boolean;
  error: string | null;

  // Role-specific data
  farmerProfile: Farmer | null;
  supplierProfile: Supplier | null;
  buyerProfile: Buyer | null;

  // Profile operations
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateFarmerProfile: (data: Partial<Farmer>) => Promise<void>;
  updateSupplierProfile: (data: Partial<Supplier>) => Promise<void>;
  updateBuyerProfile: (data: Partial<Buyer>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  refreshProfile: () => Promise<void>;

  // Role checking
  hasRole: (role: UserType) => boolean;
  getRoleInfo: () => { role: UserType; label: string; permissions: string[] } | null;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, farmer, supplier, buyer } = useAuth();
  const [profile, setProfile] = useState<User | Farmer | Supplier | Buyer | null>(null);
  const [farmerProfile, setFarmerProfile] = useState<Farmer | null>(null);
  const [supplierProfile, setSupplierProfile] = useState<Supplier | null>(null);
  const [buyerProfile, setBuyerProfile] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load profile data based on user role
  const loadProfileData = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setFarmerProfile(null);
      setSupplierProfile(null);
      setBuyerProfile(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      switch (user.role) {
        case UserType.FARMER:
          if (farmer) {
            setFarmerProfile(farmer);
            setProfile(farmer);
          } else {
            // Fetch farmer profile if not in auth context
            const farmerData = await farmerService.getFarmerById(user.id);
            setFarmerProfile(farmerData.data || null);
            setProfile(farmerData.data || null);
          }
          break;

        case UserType.SUPPLIER:
          if (supplier) {
            setSupplierProfile(supplier);
            setProfile(supplier);
          } else {
            // Fetch supplier profile if not in auth context
            const supplierData = await supplierService.getSupplierById(user.id);
            setSupplierProfile(supplierData.data || null);
            setProfile(supplierData.data || null);
          }
          break;

        case UserType.BUYER:
          if (buyer) {
            setBuyerProfile(buyer);
            setProfile(buyer);
          } else {
            // Fetch buyer profile if not in auth context
            const buyerData = await buyerService.getBuyerById(user.id);
            setBuyerProfile(buyerData.data || null);
            setProfile(buyerData.data || null);
          }
          break;

        case UserType.ADMIN:
        case UserType.GOVERNMENT:
          // For admin and government, use basic user profile
          setProfile(user);
          break;

        default:
          setProfile(user);
      }
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Profile loading error:', err);
    } finally {
      setLoading(false);
    }
  }, [user, farmer, supplier, buyer]);

  // Initial load and when auth state changes
  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  // Update basic user profile
  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await userService.updateProfile(user.id, data);
      if (response.success && response.data) {
        setProfile(prev => prev ? { ...prev, ...response.data } : null);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating profile');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update farmer-specific profile
  const updateFarmerProfile = async (data: Partial<Farmer>) => {
    if (!farmerProfile) return;

    setLoading(true);
    setError(null);

    try {
      const response = await farmerService.updateFarmer(farmerProfile.id, data);
      if (response.success && response.data) {
        setFarmerProfile(response.data);
        setProfile(response.data);
      } else {
        setError(response.message || 'Failed to update farmer profile');
      }
    } catch (err) {
      setError('An error occurred while updating farmer profile');
      console.error('Farmer profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update supplier-specific profile
  const updateSupplierProfile = async (data: Partial<Supplier>) => {
    if (!supplierProfile) return;

    setLoading(true);
    setError(null);

    try {
      const response = await supplierService.updateSupplier(supplierProfile.id, data);
      if (response.success && response.data) {
        setSupplierProfile(response.data);
        setProfile(response.data);
      } else {
        setError(response.message || 'Failed to update supplier profile');
      }
    } catch (err) {
      setError('An error occurred while updating supplier profile');
      console.error('Supplier profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update buyer-specific profile
  const updateBuyerProfile = async (data: Partial<Buyer>) => {
    if (!buyerProfile) return;

    setLoading(true);
    setError(null);

    try {
      const response = await buyerService.updateBuyer(buyerProfile.id, data);
      if (response.success && response.data) {
        setBuyerProfile(response.data);
        setProfile(response.data);
      } else {
        setError(response.message || 'Failed to update buyer profile');
      }
    } catch (err) {
      setError('An error occurred while updating buyer profile');
      console.error('Buyer profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Upload avatar
  const uploadAvatar = async (file: File): Promise<string> => {
    try {
      const response = await userService.uploadAvatar(file);
      if (response.success && response.data) {
        // Update profile with new avatar
        setProfile(prev => prev ? { ...prev, avatar: response.data || '' } : null);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to upload avatar');
      }
    } catch (err) {
      setError('Failed to upload avatar');
      throw err;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    await loadProfileData();
  };

  // Role checking
  const hasRole = (role: UserType): boolean => {
    return user?.role === role;
  };

  // Get role information
  const getRoleInfo = () => {
    if (!user) return null;

    const roleInfoMap = {
      [UserType.FARMER]: {
        role: UserType.FARMER,
        label: 'Farmer',
        permissions: ['view_products', 'create_products', 'manage_orders', 'view_analytics']
      },
      [UserType.SUPPLIER]: {
        role: UserType.SUPPLIER,
        label: 'Supplier',
        permissions: ['view_products', 'create_products', 'manage_inventory', 'view_orders']
      },
      [UserType.BUYER]: {
        role: UserType.BUYER,
        label: 'Buyer',
        permissions: ['view_products', 'create_orders', 'manage_cart', 'view_orders']
      },
      [UserType.ADMIN]: {
        role: UserType.ADMIN,
        label: 'Administrator',
        permissions: ['manage_users', 'view_analytics', 'manage_system', 'view_all_data']
      },
      [UserType.GOVERNMENT]: {
        role: UserType.GOVERNMENT,
        label: 'Government Official',
        permissions: ['view_reports', 'monitor_system', 'access_analytics', 'regulatory_oversight']
      }
    };

    return roleInfoMap[user.role] || null;
  };

  const value: ProfileContextValue = {
    profile,
    loading,
    error,
    farmerProfile,
    supplierProfile,
    buyerProfile,
    updateProfile,
    updateFarmerProfile,
    updateSupplierProfile,
    updateBuyerProfile,
    uploadAvatar,
    refreshProfile,
    hasRole,
    getRoleInfo,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within a ProfileProvider');
  return context;
}
