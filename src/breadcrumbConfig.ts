const breadcrumbConfig = [
  {
    breadcrumb: 'HK_Group',
    path: '/hk_group',
  },
  {
    exact: true,
    breadcrumb: 'Quản lý sản phẩm',
    path: '/hk_group/product',
  },
  {
    breadcrumb: 'Loại sản phẩm',
    path: '/hk_group/product/type',
  },
  {
    breadcrumb: 'Danh sách sản phẩm',
    path: '/hk_group/product/danh_sach',
  },
  {
    breadcrumb: 'Chi tiết danh sách sản phẩm',
    path: '/hk_group/product/danh_sach/:id',
  },
  {
    breadcrumb: 'Nhóm sản phẩm',
    path: '/hk_group/product/type/product_group',
  },
  {
    breadcrumb: 'Chi tiết nhóm sản phẩm',
    path: '/hk_group/product/type/product_group/:id',
  },
  {
    breadcrumb: 'Nhóm điều trị',
    path: '/hk_group/product/type/nhom_dieu_tri',
  },
  {
    breadcrumb: 'Chi tiết nhóm điều trị',
    path: '/hk_group/product/type/nhom_dieu_tri/:id',
  },
  {
    breadcrumb: 'Dạng dùng',
    path: '/hk_group/product/type/usage',
  },
  {
    breadcrumb: 'Chi tiết dạng dùng',
    path: '/hk_group/product/type/usage/:id',
  },
  {
    breadcrumb: 'Đơn vị đo lường',
    path: '/hk_group/product/don_vi',
  },
  {
    breadcrumb: 'Chi tiết đơn vị đo lường',
    path: '/hk_group/product/don_vi/:id',
  },
];

export default breadcrumbConfig;
