import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children,isDarkMode }) => {
  const isAuthenticated = localStorage.getItem('authToken'); // Replace with your auth check

  return isAuthenticated ? children : <Navigate to="/wallet" replace />;
};

export default PrivateRoute;