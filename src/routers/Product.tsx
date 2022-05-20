import { Outlet, RouteObject } from 'react-router-dom';
import {
  Measure,
  MeasureDetails,
   ProductGroup, ProductGroupDetails, ProductList, TreatmentGroup, TreatmentGroupDetails, Usage, UsageDetails, Supplier
} from 'views/HK_Group/Product';

const QLSanPhamRoutes: RouteObject = {
  path: 'hk_group/product',
  element: <Outlet />,
  children: [
    {
      path: 'list',
      children: [
        { index:true, element: <ProductList /> },
        // { path: ':id', element: <ProductDetails /> },
      ],
    },
    {
      path: 'type',
      children: [
        {
          path: 'usage',
          children: [
            { index:true, element: <Usage /> },
            { path: ':id', element: <UsageDetails /> },
          ],
        },
        {
          path: 'treatment_group',
          children: [
            { index:true, element: <TreatmentGroup /> },
            { path: ':id', element: <TreatmentGroupDetails /> },
          ],
        },
    
        {
          path: 'product_group',
          children: [
            { index:true, element: <ProductGroup /> },
            { path: ':id', element: <ProductGroupDetails /> },
          ],
        },
      ],
    },
    {
      path: 'measure',
      children: [
        { index:true, element: <Measure /> },
        { path: ':id', element: <MeasureDetails /> },
      ],
    },
    {
      path: 'supplier',
      children: [
        { index:true, element: <Supplier /> },
        // { path: ':id', element: <SupplierDetails /> },
      ],
    },
  ],
};

export default QLSanPhamRoutes;
