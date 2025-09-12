import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, mockCreators, mockBuyers, User, Creator, Buyer } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'buyer' | 'creator') => Promise<boolean>;
  register: (email: string, password: string, role: 'buyer' | 'creator', name: string) => Promise<boolean>;
  logout: () => void;
  accessToken: string | null;
  refreshToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock JWT token generation
const generateMockToken = (user: User): string => {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
  };
  
  // In real app, this would be a proper JWT
  return btoa(JSON.stringify(payload));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('stockless_access_token');
    const storedRefreshToken = localStorage.getItem('stockless_refresh_token');
    
    if (storedToken && storedRefreshToken) {
      try {
        const payload = JSON.parse(atob(storedToken));
        
        // Get all users including newly registered ones
        const storedUsers = localStorage.getItem('stockless_users');
        const allUsers = storedUsers ? JSON.parse(storedUsers) : mockUsers;
        const foundUser = allUsers.find((u: User) => u.id === payload.sub);
        
        if (foundUser && payload.exp > Math.floor(Date.now() / 1000)) {
          setUser(foundUser);
          setAccessToken(storedToken);
          setRefreshToken(storedRefreshToken);
        } else {
          // Token expired, clear storage
          localStorage.removeItem('stockless_access_token');
          localStorage.removeItem('stockless_refresh_token');
        }
      } catch (error) {
        console.error('Invalid token format');
        localStorage.removeItem('stockless_access_token');
        localStorage.removeItem('stockless_refresh_token');
      }
    }
  }, []);

  const login = async (email: string, password: string, role: 'buyer' | 'creator'): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get fresh users data including newly registered ones
    const storedUsers = localStorage.getItem('stockless_users');
    const allUsers = storedUsers ? JSON.parse(storedUsers) : mockUsers;
    
    // Find user by email and role
    const foundUser = allUsers.find((u: User) => u.email === email && u.role === role);
    
    if (foundUser) {
      const accessToken = generateMockToken(foundUser);
      const refreshToken = generateMockToken({ ...foundUser, id: foundUser.id + '_refresh' });
      
      setUser(foundUser);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      
      // Store tokens in localStorage
      localStorage.setItem('stockless_access_token', accessToken);
      localStorage.setItem('stockless_refresh_token', refreshToken);
      
      return true;
    }
    
    return false;
  };

  const register = async (email: string, password: string, role: 'buyer' | 'creator', name: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get existing users
    const storedUsers = localStorage.getItem('stockless_users');
    const existingUsers = storedUsers ? JSON.parse(storedUsers) : mockUsers;
    
    // Check if user already exists
    const userExists = existingUsers.find((u: User) => u.email === email);
    if (userExists) {
      return false; // User already exists
    }
    
    // Generate new user ID
    const newUserId = role + Date.now();
    const newUser: User = {
      id: newUserId,
      email,
      role,
      name
    };
    
    // Add to users list
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('stockless_users', JSON.stringify(updatedUsers));
    
    // If creator, add to creators list
    if (role === 'creator') {
      const storedCreators = localStorage.getItem('stockless_creators');
      const existingCreators = storedCreators ? JSON.parse(storedCreators) : mockCreators;
      
      const newCreator: Creator = {
        id: newUserId,
        name,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face`,
        tags: [],
        restrictions: [],
        socialMediaConnected: false,
        socialMediaType: 'Instagram',
        contractSigned: false,
        gallery: []
      };
      
      const updatedCreators = [...existingCreators, newCreator];
      localStorage.setItem('stockless_creators', JSON.stringify(updatedCreators));
    }
    
    // If buyer, add to buyers list
    if (role === 'buyer') {
      const storedBuyers = localStorage.getItem('stockless_buyers');
      const existingBuyers = storedBuyers ? JSON.parse(storedBuyers) : mockBuyers;
      
      const newBuyer: Buyer = {
        id: newUserId,
        name,
        email
      };
      
      const updatedBuyers = [...existingBuyers, newBuyer];
      localStorage.setItem('stockless_buyers', JSON.stringify(updatedBuyers));
    }
    
    // Auto-login after registration
    const accessToken = generateMockToken(newUser);
    const refreshToken = generateMockToken({ ...newUser, id: newUser.id + '_refresh' });
    
    setUser(newUser);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    
    // Store tokens in localStorage
    localStorage.setItem('stockless_access_token', accessToken);
    localStorage.setItem('stockless_refresh_token', refreshToken);
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('stockless_access_token');
    localStorage.removeItem('stockless_refresh_token');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    accessToken,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};