import { Outlet, RouteObject } from 'react-router-dom';
import { Supplier, SupplierDetails } from 'views/HK_Trading';

const HKGroupRoutes: RouteObject = {
  path: 'hk_trading',
  element: <Outlet />,
  children: [
    {
      path: 'supplier',
      children: [
        { index:true, element: <Supplier /> },
        { path: ':id', element: <SupplierDetails /> },
      ],
    },
  ],
};

export default HKGroupRoutes;
