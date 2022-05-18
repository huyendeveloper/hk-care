import { lazy } from 'react';
import Loadable from 'routers/Loadable';

export const DanhSach = Loadable(
  lazy(() => import('views/HK_Group/SanPham/DanhSach'))
);
export const TTDanhSach = Loadable(
  lazy(() => import('views/HK_Group/SanPham/DanhSach/Details'))
);

export const DangDung = Loadable(
  lazy(() => import('views/HK_Group/SanPham/Type/Usage'))
);
export const TTDangDung = Loadable(
  lazy(() => import('views/HK_Group/SanPham/Type/Usage/Details'))
);
export const NhomDieuTri = Loadable(
  lazy(() => import('views/HK_Group/SanPham/Type/NhomDieuTri'))
);
export const TTNhomDieuTri = Loadable(
  lazy(() => import('views/HK_Group/SanPham/Type/NhomDieuTri/Details'))
);
export const NhomSanPham = Loadable(
  lazy(() => import('views/HK_Group/SanPham/Type/ProductGroup'))
);
export const TTNhomSanPham = Loadable(
  lazy(() => import('views/HK_Group/SanPham/Type/ProductGroup/Details'))
);
export const DonVi = Loadable(
  lazy(() => import('views/HK_Group/SanPham/DonVi'))
);
export const TTDonVi = Loadable(
  lazy(() => import('views/HK_Group/SanPham/DonVi/Details'))
);
