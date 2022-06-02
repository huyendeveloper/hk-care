import { Outlet, RouteObject } from 'react-router-dom';
import { ProductDetails, ProductList, ProductListCreate } from 'views/HK_Care/Product';

const HKCareRoutes: RouteObject = {
  path: 'hk_care/product',
  element: <Outlet />,
  children: [
    {
      path: 'list',
      children: [
        { index:true, element: <ProductList /> },
        {path:'create', element: <ProductListCreate/>},
        { path: ':id', element: <ProductDetails /> },
      ],
    },
  ],
};

export default HKCareRoutes;
