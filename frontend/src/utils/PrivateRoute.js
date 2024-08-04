import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserInfo } from '../services/authService';

const PrivateRoute = ({ element }) => {
  const user = getUserInfo();

  return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
