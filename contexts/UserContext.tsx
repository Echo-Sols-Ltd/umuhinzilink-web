import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserType } from '@/types';
import { notify } from '@/lib/notify';
import { userService } from '@/services/users';
import { useAuth } from './AuthContext';
import { ChatUser } from '@/types';
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
  resetUnreadCountForUser: (id: string) => void
}

const UserContext = createContext<UserContextType | null>(null);

function UserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
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
    const fetchChatUsers = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const res = await chatService.getAllChatUsers();

        if (!res.success) {
          notify.error('Users cannot be fetched', 'Server error');
          return;
        }

        if (res.data) {
          setChatUsers(res.data);
        }
      } catch {
        notify.error('Users cannot be fetched', 'Server error');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
    fetchChatUsers()
  }, [user]);

  const resetUnreadCountForUser = async (id: string) => {
    setChatUsers(chatUsers.map(u => u.id === id ? { ...u, unreadMessage: 0 } : u))
  }

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
        resetUnreadCountForUser
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
