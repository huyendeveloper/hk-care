import { FC, ReactNode, useEffect, useMemo } from 'react';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from 'redux/store';
import { Role } from 'types';
import LocalStorage from 'utils/LocalStorage';

interface SectionItem {
  title: string;
  children?: SectionItem[];
  info?: () => JSX.Element | null;
  icon?: ReactNode;
  path?: string;
  roles?: Role[];
}

const PrivateRoute: FC = ({ children }) => {
  const auth = useSelector((state: RootState) => state.auth);
  // const location = useLocation();
  // let match = false;

  const { isAuthenticated } = auth;

  // const sections = useMemo(() => getSections(), []);

  // const itemsFiltered = sections.filter(
  //   (item) => item.roles && item.roles.some((r) => auth.userRoles.includes(r))
  // );

  // const checkMath = (items: SectionItem[]) => {
  //   items.forEach((item: SectionItem) => {
  //     const partialMatch = location.pathname.startsWith(String(item.path));

  //     if (partialMatch) {
  //       match = true;
  //     }
  //     if (item.children) {
  //       checkMath(item.children);
  //     }
  //   });
  // };

  // checkMath(itemsFiltered);

  // if (
  //   (location.pathname === '/' && isAuthenticated) ||
  //   (location.pathname === '/login' && !isAuthenticated)
  // ) {
  //   match = true;
  // }

  // useEffect(() => {}, [itemsFiltered]);

  // if (!match) {
  //   return <Navigate to="/" replace />;
  // }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Fragment>{children}</Fragment>;
};

export default PrivateRoute;
