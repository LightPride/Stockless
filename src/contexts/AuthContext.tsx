import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mockCreators, mockBuyers, User, Creator, Buyer } from '@/data/mockData';
import type { Session, AuthError } from '@supabase/supabase-js';
import defaultAvatar from '@/assets/default-avatar.png';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'buyer' | 'creator') => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, role: 'buyer' | 'creator', name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        if (session?.user) {
          // Get user metadata and create our local user object
          const localUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            role: (session.user.user_metadata?.role || 'buyer') as 'buyer' | 'creator',
            name: session.user.user_metadata?.name || session.user.email || 'Unknown'
          };
          setUser(localUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      if (session?.user) {
        const localUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          role: (session.user.user_metadata?.role || 'buyer') as 'buyer' | 'creator',
          name: session.user.user_metadata?.name || session.user.email || 'Unknown'
        };
        setUser(localUser);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, role: 'buyer' | 'creator'): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Check if the user's role matches
      const userRole = data.user?.user_metadata?.role;
      if (userRole && userRole !== role) {
        await supabase.auth.signOut();
        return { success: false, error: `Please login as a ${role}` };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (email: string, password: string, role: 'buyer' | 'creator', name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            role,
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Store additional data in localStorage for backward compatibility
        const newUserId = data.user.id;
        
        // If creator, add to creators list
        if (role === 'creator') {
          const storedCreators = localStorage.getItem('stockless_creators');
          const existingCreators = storedCreators ? JSON.parse(storedCreators) : mockCreators;
          
          const newCreator: Creator = {
            id: newUserId,
            name,
            avatar: defaultAvatar,
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
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!session?.user,
    login,
    register,
    logout,
    session,
    loading,
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