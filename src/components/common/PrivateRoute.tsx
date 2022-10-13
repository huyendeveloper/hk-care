import moment from 'moment';
import { FC, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { logout } from 'redux/slices';
import { RootState } from 'redux/store';

const PrivateRoute: FC = ({ children }) => {
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, lastLogin } = auth;

  const returnLogin = async () => {
    await dispatch(logout());
    return navigate('/login');
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!lastLogin || moment().format('yyyy-MM-DD') !== lastLogin) {
    returnLogin();
  }

  return <Fragment>{children}</Fragment>;
};

export default PrivateRoute;
