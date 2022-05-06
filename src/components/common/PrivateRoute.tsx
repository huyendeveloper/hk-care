import useAuth from 'hooks/useAuth';
import type { FC } from 'react';
import { Fragment } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute: FC = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Fragment>{children}</Fragment>;
};

export default PrivateRoute;
