import { lazy } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import Loadable from './Loadable';

const Request = Loadable(lazy(() => import('views/HK_Trading/Request')));
 
const HKGroupRoutes: RouteObject = {
  path: 'hk_trading',
  element: <Outlet />,
  children: [
    {
      path: "request",
      children: [{ index: true, element: <Request /> }],
    },
  ],
};

export default HKGroupRoutes;
