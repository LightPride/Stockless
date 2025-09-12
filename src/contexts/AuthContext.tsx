import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, User } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'buyer' | 'creator') => Promise<boolean>;
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
        const foundUser = mockUsers.find(u => u.id === payload.sub);
        
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
    
    // Find user by email and role
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);
    
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