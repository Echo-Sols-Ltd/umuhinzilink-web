interface Address {
  district: string;
  province: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'BUYER' | 'FARMER' | 'SUPPLIER' | 'ADMIN';
  names: string;
  phoneNumber: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  verified: boolean;
  language: string;
  address: Address;
}

export interface AuthData {
  token: string;
  user: Omit<User, 'password'>;
  message?: string;
  success?: boolean;
}

// Mock users with different roles
export let mockUsers: User[] = [
  {
    id: '1',
    email: 'buyer@gmail.com',
    password: 'password123',
    role: 'BUYER' as const,
    names: 'John Buyer',
    phoneNumber: '+250700000001',
    avatar: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: null,
    verified: true,
    language: 'en',
    address: {
      district: 'Kicukiro',
      province: 'Kigali',
    },
  },
  {
    id: '2',
    email: 'farmer@gmail.com',
    password: 'password123',
    role: 'FARMER' as const,
    names: 'Jane Farmer',
    phoneNumber: '+250700000002',
    avatar: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: null,
    verified: true,
    language: 'rw',
    address: {
      district: 'Musanze',
      province: 'Northern',
    },
  },
  {
    id: '3',
    email: 'supplier@gmail.com',
    password: 'password123',
    role: 'SUPPLIER' as const,
    names: 'Bob Supplier',
    phoneNumber: '+250700000003',
    avatar: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: null,
    verified: true,
    language: 'en',
    address: {
      district: 'Gasabo',
      province: 'Kigali',
    },
  },
  // Admin user for testing
  {
    id: '4',
    email: 'admin@gmail.com',
    password: 'password123',
    role: 'ADMIN' as const,
    names: 'Admin',
    phoneNumber: '+250700000004',
    avatar: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: null,
    verified: true,
    language: 'en',
    address: {
      district: 'Nyarugenge',
      province: 'Kigali',
    },
  },
];

// Mock signup function
export const mockSignup = async (
  userData: Omit<
    User,
    'id' | 'createdAt' | 'updatedAt' | 'lastLogin' | 'verified' | 'avatar' | 'language' | 'address'
  > & { role: 'BUYER' | 'FARMER' | 'SUPPLIER' }
): Promise<AuthData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if user already exists
      const userExists = mockUsers.some(user => user.email === userData.email);

      if (userExists) {
        reject(new Error('User with this email already exists'));
        return;
      }

      // Create new user
      const newUser: User = {
        ...userData,
        id: (mockUsers.length + 1).toString(),
        avatar: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: null,
        verified: true,
        language: 'en',
        address: {
          district: 'Kigali',
          province: 'Kigali',
        },
      };

      // Add to mock users
      mockUsers = [...mockUsers, newUser];

      // Create user object without password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = newUser;

      // Return auth data
      const authData: AuthData = {
        token: `mock-jwt-token-${newUser.id}`,
        user: userWithoutPassword,
        message: 'User registered successfully',
        success: true,
      };

      resolve(authData);
    }, 500);
  });
};

// Mock login function
export const mockLogin = async (email: string, password: string): Promise<AuthData> => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      const user = mockUsers.find(user => user.email === email && user.password === password);

      if (user) {
        // Update last login
        const updatedUser = {
          ...user,
          lastLogin: new Date().toISOString(),
        };

        // Update the user in the mock database
        mockUsers = mockUsers.map(u => (u.id === user.id ? updatedUser : u));

        // Create user object without password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = updatedUser;

        const authData: AuthData = {
          token: `mock-jwt-token-${user.id}`,
          user: userWithoutPassword,
          success: true,
        };
        resolve(authData);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 500); // Simulate network delay
  });
};

// Mock authentication check
export const checkMockAuth = (): { isAuthenticated: boolean; user: User | null } => {
  if (typeof window === 'undefined') return { isAuthenticated: false, user: null };

  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const user = JSON.parse(userStr);
    // Verify the token format matches our mock pattern
    if (token.startsWith('mock-jwt-token-')) {
      return { isAuthenticated: true, user };
    }
    return { isAuthenticated: false, user: null };
  } catch (error) {
    console.error('Error parsing user data:', error);
    return { isAuthenticated: false, user: null };
  }
};

// Mock logout
export const mockLogout = (): Promise<void> => {
  return new Promise(resolve => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    resolve();
  });
};
