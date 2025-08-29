
/**
 * ProtectedRoute component restricts access to its children based on user authentication and allowed roles.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The content to render if access is allowed.
 * @param {string[]} props.allowedRoles - Array of roles permitted to access the route.
 * @returns {React.ReactNode} - Renders children if user is authenticated and has an allowed role, otherwise redirects.
 */
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
