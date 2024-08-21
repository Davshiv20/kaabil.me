import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  return isAuthenticated ? Element : <Navigate to="/" />
};

export default ProtectedRoute;
