import { FC, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from 'redux/store';

const PrivateRoute: FC = ({ children }) => {
  const auth = useSelector((state: RootState) => state.auth);

  const { isAuthenticated } = auth;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Fragment>{children}</Fragment>;
};

export default PrivateRoute;
