import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserType } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { userService } from '@/services/users';
import { useAuth } from './AuthContext';

interface UserContextType {
  users: User[];
  loading: boolean;
  setCurrentUser: (user: User) => void;
  currentUser: User | null;
  farmerUsers: User[];
  buyerUsers: User[];
  supplierUsers: User[];
}

const UserContext = createContext<UserContextType | null>(null);

function UserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast()
  useEffect(() => {
    async function fetchUsers() {
      if (!user) return;
      setLoading(true);
      try {
        const res = await userService.getAllUsers();
        if (!res.success) {
          toast({
            title: 'Server error',
            description: 'Users cannot be fetched',
            variant: 'error',
          });
          return;
        }
        if (res.data) {
          setUsers(res.data);
        }
      } catch {
        toast({
          title: 'Server error',
          description: 'Users cannot be fetched',
          variant: 'error',
        });
      }
    }

    fetchUsers();
  }, [user]);

  const farmerUsers = users.filter(u => u.role === UserType.FARMER);
  const buyerUsers = users.filter(u => u.role === UserType.BUYER);
  const supplierUsers = users.filter(u => u.role === UserType.SUPPLIER);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        setCurrentUser,
        currentUser,
        farmerUsers,
        buyerUsers,
        supplierUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within an UserProvider');
  }
  return context;
}

export { useUser, UserProvider };
