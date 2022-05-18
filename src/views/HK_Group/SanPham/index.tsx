import { lazy } from 'react';
import Loadable from 'routers/Loadable';

export const DanhSach = Loadable(
  lazy(() => import('views/HK_Group/SanPham/DanhSach'))
);
export const TTDanhSach = Loadable(
  lazy(() => import('views/HK_Group/SanPham/DanhSach/Details'))
);

export const DangDung = Loadable(
  lazy(() => import('views/HK_Group/SanPham/Loai/DangDung'))
);
export const TTDangDung = Loadable(
  lazy(() => import('views/HK_Group/SanPham/Loai/DangDung/Details'))
);
export const NhomDieuTri = Loadable(
  lazy(() => import('views/HK_Group/SanPham/Loai/NhomDieuTri'))
);
export const TTNhomDieuTri = Loadable(
  lazy(() => import('views/HK_Group/SanPham/Loai/NhomDieuTri/Details'))
);
export const NhomSanPham = Loadable(
  lazy(() => import('views/HK_Group/SanPham/Loai/ProductGroup'))
);
export const TTNhomSanPham = Loadable(
  lazy(() => import('views/HK_Group/SanPham/Loai/ProductGroup/Details'))
);
export const DonVi = Loadable(
  lazy(() => import('views/HK_Group/SanPham/DonVi'))
);
export const TTDonVi = Loadable(
  lazy(() => import('views/HK_Group/SanPham/DonVi/Details'))
);
