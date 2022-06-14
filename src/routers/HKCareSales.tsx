import { Outlet, RouteObject } from 'react-router-dom';
import { SalesOrder, CreateSalesOrder } from 'views/HK_Care/Sales';

const HKCareRoutes: RouteObject = {
  path: 'hk_care/sales',
  element: <Outlet />,
  children: [
    {
      path: 'order',
      children: [
        { index:true, element: <SalesOrder /> }, 
       
      ],
    },
  ],
};

export default HKCareRoutes;
