import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function ProtectRoute({ requiredRole }) {
  const { user } = useAuth();

  if (user) {
    return user.role === requiredRole ? <Outlet /> : <Navigate to="/" />;
  } else {
    return <Navigate to="/" />;
  }
}
