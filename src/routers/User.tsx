import { Outlet, RouteObject } from 'react-router-dom';
import Loadable from './Loadable';
import { lazy } from 'react';


// User Profile
const UserProfile = Loadable(lazy(() => import('views/User/UserProfile')));

const UserRoutes: RouteObject = {
  path: 'user',
  element: <Outlet />,
  children: [
    {
      path: 'profile',
      children: [{ index: true, element: <UserProfile /> }],
    },
  ],
};

export default UserRoutes;
