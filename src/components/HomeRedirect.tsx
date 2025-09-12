import React from 'react';
import { Navigate } from 'react-router-dom';
import Landing from '@/pages/Landing';
import { useAuth } from '@/contexts/AuthContext';

const HomeRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (user?.role === 'buyer') {
      return <Navigate to="/buyers" replace />;
    }
    if (user?.role === 'creator') {
      return <Navigate to={`/creator-dashboard/${user.id}`} replace />;
    }
  }

  return <Landing />;
};

export default HomeRedirect;
