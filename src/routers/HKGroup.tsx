import { lazy } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import Loadable from './Loadable';

export const Tenant = Loadable(
    lazy(() => import('views/HK_Group/Tenant'))
  );

const HKGroupRoutes: RouteObject = {
  path: 'hk_group',
  element: <Outlet />,
  children: [
    {
      path: 'tenant',
      children: [
        { index:true, element: <Tenant /> },
        // { path: ':id', element: <ProductDetails /> },
      ],
    }, 
  ],
};

export default HKGroupRoutes;
