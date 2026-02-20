import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserType } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { userService } from '@/services/users';
import { useAuth } from './AuthContext';
import { ChatUser } from '@/types/chat';
import { chatService } from '@/services/chat';

interface UserContextType {
  users: User[];
  chatUsers: ChatUser[]
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
  const { toast } = useToast();
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([])
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
      } finally {
        setLoading(false);
      }
    };
    const fetchChatUsers = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const res = await chatService.getAllChatUsers();

        if (!res.success) {
          toast({
            title: 'Server error',
            description: 'Users cannot be fetched',
            variant: 'error',
          });
          return;
        }

        if (res.data) {
          setChatUsers(res.data);
        }
      } catch {
        toast({
          title: 'Server error',
          description: 'Users cannot be fetched',
          variant: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
    fetchChatUsers()
  }, [user]);

  // Filter users by role
  const farmerUsers = users.filter(u => u.role === UserType.FARMER);
  const buyerUsers = users.filter(u => u.role === UserType.BUYER);
  const supplierUsers = users.filter(u => u.role === UserType.SUPPLIER);

  return (
    <UserContext.Provider
      value={{
        users,
        chatUsers,
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

// Custom hook to access user context
function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within an UserProvider');
  }
  return context;
}

export { useUser, UserProvider };
