import React from 'react';
import { Navigate } from 'react-router-dom';
import Landing from '@/pages/Landing';
import { useAuth } from '@/contexts/AuthContext';

const HomeRedirect: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();

  console.log('HomeRedirect - loading:', loading, 'isAuthenticated:', isAuthenticated, 'user:', user);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (isAuthenticated && user && user.id) {
    console.log('User authenticated, redirecting based on role:', user.role, 'User ID:', user.id);
    if (user.role === 'buyer') {
      return <Navigate to="/buyers" replace />;
    }
    if (user.role === 'creator') {
      const redirectPath = `/creator-dashboard/${user.id}`;
      console.log('Redirecting creator to:', redirectPath);
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <Landing />;
};

export default HomeRedirect;
