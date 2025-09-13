import React from 'react';
import { Navigate } from 'react-router-dom';
import Landing from '@/pages/Landing';
import { useAuth } from '@/contexts/AuthContext';

const HomeRedirect: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (isAuthenticated && user) {
    if (user.role === 'buyer') {
      return <Navigate to="/buyers" replace />;
    }
    if (user.role === 'creator') {
      return <Navigate to={`/creator-dashboard/${user.id}`} replace />;
    }
  }

  return <Landing />;
};

export default HomeRedirect;
