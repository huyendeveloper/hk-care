import { Outlet, RouteObject } from 'react-router-dom';
import {
  DangDung, DanhSach, DonVi, NhomDieuTri, NhomSanPham, TTDangDung, TTDanhSach, TTDonVi, TTNhomDieuTri, TTNhomSanPham
} from 'views/HK_Group/SanPham';

const QLSanPhamRoutes: RouteObject = {
  path: 'hk_group/product',
  element: <Outlet />,
  children: [
    {
      path: 'danh_sach',
      children: [
        { index:true, element: <DanhSach /> },
        { path: ':id', element: <TTDanhSach /> },
      ],
    },
    {
      path: 'type',
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
          path: 'product_group',
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
};

export default QLSanPhamRoutes;
