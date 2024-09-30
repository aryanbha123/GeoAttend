import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function ProtectRoute({ requiredRole }) {
  const { user } = useAuth();
  // const user = {
  //   role: "Employee"
  // };

  if (user) {
    console.log("This is protected route. User role: " + user.role);
    // Check if the user's role matches the required role
    return user.role === requiredRole ? <Outlet /> : <Navigate to="/" />;
  } else {
    return <Navigate to="/" />;
  }
}
