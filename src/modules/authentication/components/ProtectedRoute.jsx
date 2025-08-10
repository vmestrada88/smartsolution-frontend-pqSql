import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // If no user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user's role is not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If everything is fine, render the content
  return children;
};

export default ProtectedRoute;
