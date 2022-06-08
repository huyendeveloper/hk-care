import { Outlet, RouteObject } from 'react-router-dom';
 
const HKGroupRoutes: RouteObject = {
  path: 'hk_trading',
  element: <Outlet />,
  children: [
     
  ],
};

export default HKGroupRoutes;
