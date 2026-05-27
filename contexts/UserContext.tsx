import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole} from '@/types';
import { notify } from '@/lib/notify';
import { userService } from '@/services/users';
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

  // Fetch all users from API
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const res = await userService.getAllUsers();

        if (!res.success) {
          notify.error('Users cannot be fetched', 'Server error');
          return;
        }

        if (res.data) {
          setUsers(res.data);
        }
      } catch {
        notify.error('Users cannot be fetched', 'Server error');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, [user]);



  // Filter users by role
  const buyerUsers = users.filter(u => u.role === UserRole.BUYER);
  const sellerUsers = users.filter(u => u.role === UserRole.SELLER);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        setCurrentUser,
        currentUser,
        sellerUsers,
        buyerUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to access user context
function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within an UserProvider');
  }
  return context;
}

export { useUser, UserProvider };
