import { lazy } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import { SalesOrder } from 'views/HK_Care/Sales';
import Loadable from './Loadable';

export const SalesOrderDetail = Loadable(
  lazy(() => import('views/HK_Care/Sales/Order/Details'))
);


const HKCareRoutes: RouteObject = {
  path: 'hk_care/sales',
  element: <Outlet />,
  children: [
    {
      path: 'order',
      children: [
        { index:true, element: <SalesOrder /> }, 
        { path: ':id', element: <SalesOrderDetail /> }, 
       
      ],
    },
  ],
};

export default HKCareRoutes;
