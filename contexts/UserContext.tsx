'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@/types';
import { useAuth } from './AuthContext';

interface UserContextType {
  users: User[];
  loading: boolean;
  setCurrentUser: (user: User) => void;
  currentUser: User | null;
  buyerUsers: User[];
  sellerUsers: User[];
}

const UserContext = createContext<UserContextType | null>(null);

function UserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!user) {
      setUsers([]);
      return;
    }

    // Only admins need the global users list; other roles use profile/auth data.
    if (user.role !== UserRole.ADMIN) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { adminService } = await import('@/services/admin');
        const res = await adminService.getAllUsers(0, 50);
        setUsers(res.data ?? []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const buyerUsers = users.filter(u => u.role === UserRole.BUYER);
  const sellerUsers = users.filter(u => u.role === UserRole.SELLER);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        setCurrentUser,
        currentUser,
        buyerUsers,
        sellerUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export { UserProvider, useUser };
