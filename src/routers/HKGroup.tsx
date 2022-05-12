import { lazy } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import Loadable from './Loadable';

const DangDung = Loadable(lazy(() => import('views/HK_Group/SanPham/Loai/DangDung')));
const TTDangDung = Loadable(lazy(() => import('views/HK_Group/SanPham/Loai/DangDung/Details')));

const NhomDieuTri = Loadable(lazy(() => import('views/HK_Group/SanPham/Loai/NhomDieuTri')));
const TTNhomDieuTri = Loadable(lazy(() => import('views/HK_Group/SanPham/Loai/NhomDieuTri/Details')));

const NhomSanPham = Loadable(lazy(() => import('views/HK_Group/SanPham/Loai/NhomSanPham')));
const TTNhomSanPham = Loadable(lazy(() => import('views/HK_Group/SanPham/Loai/NhomSanPham/Details')));

const DonVi = Loadable(lazy(() => import('views/HK_Group/SanPham/DonVi')));
const TTDonVi = Loadable(lazy(() => import('views/HK_Group/SanPham/DonVi/Details')));

const HKGroupRoutes: RouteObject = {
  path: 'hk_group',
  element: <Outlet />,
  children: [
    {
      path: 'san_pham',
      children: [
        {
          path: 'loai',
          children: [
            {
              path: 'dang_dung',
              children: [
                { index:true, element: <DangDung /> },
                { path: ':id', element: <TTDangDung /> },
              ],
            },
            {
              path: 'nhom_dieu_tri',
              children: [
                { index:true, element: <NhomDieuTri /> },
                { path: ':id', element: <TTNhomDieuTri /> },
              ],
            },
        
            {
              path: 'nhom_san_pham',
              children: [
                { index:true, element: <NhomSanPham /> },
                { path: ':id', element: <TTNhomSanPham /> },
              ],
            },
          ],
        },
        {
          path: 'don_vi',
          children: [
            { index:true, element: <DonVi /> },
            { path: ':id', element: <TTDonVi /> },
          ],
        },
      ],
    },
    
  ],
};

export default HKGroupRoutes;
