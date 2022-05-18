import { Outlet, RouteObject } from 'react-router-dom';
import {
  Usage, ProductList, TreatmentGroup, ProductGroup, UsageDetails, ProductDetails, TreatmentGroupDetails, ProductGroupDetails
} from 'views/HK_Group/Product';

const QLSanPhamRoutes: RouteObject = {
  path: 'hk_group/product',
  element: <Outlet />,
  children: [
    {
      path: 'danh_sach',
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
    // {
    //   path: 'don_vi',
    //   children: [
    //     { index:true, element: <DonVi /> },
    //     { path: ':id', element: <TTDonVi /> },
    //   ],
    // },
    
  ],
};

export default QLSanPhamRoutes;
