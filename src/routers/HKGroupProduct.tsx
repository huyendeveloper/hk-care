import { Outlet, RouteObject } from 'react-router-dom';
import {
  Measure, ProductDetails, ProductGroup, ProductList, ReferencePrices, Supplier, SupplierDetails, TreatmentGroup, Usage
} from 'views/HK_Group/Product';

const HKGroupRoutes: RouteObject = {
  path: 'hk_group/product',
  element: <Outlet />,
  children: [
    {
      path: 'list',
      children: [
        { index:true, element: <ProductList /> },
        { path: ':id', element: <ProductDetails /> },
      ],
    },
    {
      path: 'type',
      children: [
        {
          path: 'usage',
          children: [
            { index:true, element: <Usage /> },
          ],
        },
        {
          path: 'treatment_group',
          children: [
            { index:true, element: <TreatmentGroup /> },
          ],
        },
    
        {
          path: 'product_group',
          children: [
            { index:true, element: <ProductGroup /> },
          ],
        },
      ],
    },
    {
      path: 'measure',
      children: [
        { index:true, element: <Measure /> },
      ],
    },
    {
      path: 'supplier',
      children: [
        { index:true, element: <Supplier /> },
        { path: ':id', element: <SupplierDetails /> },
      ],
    },
    {
      path:'reference_prices',
      children:[
        {index:true,element:<ReferencePrices/>}
      ]
    }
  ],
};

export default HKGroupRoutes;
