const breadcrumbConfig = [
  {
    breadcrumb: 'HK_Group',
    path: '/hk_group',
  },
  {
    exact: true,
    breadcrumb: 'Quản lý sản phẩm',
    path: '/hk_group/san_pham',
  },
  {
    breadcrumb: 'Loại sản phẩm',
    path: '/hk_group/san_pham/loai',
  },
  {
    breadcrumb: 'Nhóm sản phẩm',
    path: '/hk_group/san_pham/loai/nhom_san_pham',
  },
  {
    breadcrumb: 'Chi tiết nhóm sản phẩm',
    path: '/hk_group/san_pham/loai/nhom_san_pham/:id',
  },
  {
    breadcrumb: 'Nhóm điều trị',
    path: '/hk_group/san_pham/loai/nhom_dieu_tri',
  },
  {
    breadcrumb: 'Chi tiết nhóm điều trị',
    path: '/hk_group/san_pham/loai/nhom_dieu_tri/:id',
  },
  {
    breadcrumb: 'Dạng dùng',
    path: '/hk_group/san_pham/loai/dang_dung',
  },
  {
    breadcrumb: 'Chi tiết dạng dùng',
    path: '/hk_group/san_pham/loai/dang_dung/:id',
  },
  {
    breadcrumb: 'Đơn vị đo lường',
    path: '/hk_group/san_pham/don_vi',
  },
  {
    breadcrumb: 'Chi tiết đơn vị đo lường',
    path: '/hk_group/san_pham/don_vi/:id',
  },
];

export default breadcrumbConfig;
