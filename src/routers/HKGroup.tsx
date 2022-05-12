import { lazy } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import Loadable from './Loadable';

const DangDung = Loadable(lazy(() => import('views/HK_Group/SanPham/Loai/DangDung')));
const DetailsCRUD = Loadable(lazy(() => import('views/HK_Group/SanPham/Loai/DangDung/Details')));

const HKGroupRoutes: RouteObject = {
  path: 'hk_group',
  element: <Outlet />,
  children: [
    {
      path: 'san_pham/loai/dang_dung',
      children: [
        { index:true, element: <DangDung /> },
        { path: ':id', element: <DetailsCRUD /> },
      ],
    },
  ],
};

export default HKGroupRoutes;
