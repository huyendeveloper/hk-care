const breadcrumbConfig = (tennant: string) => {
  return [
    // hk group
    {
      breadcrumb: 'HK Group',
      path: '/hk_group',
    },
    {
      breadcrumb: 'Thông tin điểm bán',
      path: '/hk_group/tenant',
    },
    {
      breadcrumb: 'Quản trị người dùng',
      path: '/hk_group/users',
    },
    // hk group product
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
      path: '/hk_group/product/list',
    },
    {
      breadcrumb: 'Chi tiết sản phẩm',
      path: '/hk_group/product/list/:id',
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
      path: '/hk_group/product/type/treatment_group',
    },
    {
      breadcrumb: 'Chi tiết nhóm điều trị',
      path: '/hk_group/product/type/treatment_group/:id',
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
      path: '/hk_group/product/measure',
    },
    {
      breadcrumb: 'Chi tiết đơn vị đo lường',
      path: '/hk_group/product/measure/:id',
    },
    {
      breadcrumb: 'Nhà cung cấp',
      path: '/hk_group/product/supplier',
    },
    {
      breadcrumb: 'Chi tiết nhà cung cấp',
      path: '/hk_group/product/supplier/:id',
    },
    {
      breadcrumb: 'Giá tham chiếu',
      path: '/hk_group/product/reference_prices',
    },
    // hk care
    { breadcrumb: tennant, path: '/hk_care' },
    { breadcrumb: 'Quản lý sản phẩm', path: '/hk_care/product' },
    { breadcrumb: 'Danh sách sản phẩm', path: '/hk_care/product/list' },
    // hk care warehouse
    { breadcrumb: 'Quản lý kho', path: '/hk_care/warehouse' },
    { breadcrumb: 'Yêu cầu nhập kho', path: '/hk_care/warehouse/request' },
    { breadcrumb: 'Nhập kho', path: '/hk_care/warehouse/import' },
    {
      breadcrumb: 'Hóa đơn nhập kho',
      path: '/hk_care/warehouse/import/receipt',
    },
    {
      breadcrumb: 'Thêm hóa đơn',
      path: '/hk_care/warehouse/import/receipt/create',
    },
    { breadcrumb: 'Xuất kho', path: '/hk_care/warehouse/export' },
    { breadcrumb: 'Xuất hủy', path: '/hk_care/warehouse/export/cancel' },
    {
      breadcrumb: 'Xuất luân chuyển',
      path: '/hk_care/warehouse/export/circulation_invoice',
    },
    {
      exact: true,
      breadcrumb: 'Cập nhật hóa đơn xuất hủy',
      path: '/hk_care/warehouse/export/cancel/:id/update',
    },
    // hk care sales
    { breadcrumb: 'Quản lý bán hàng', path: '/hk_care/sales' },
    { breadcrumb: 'Hóa đơn bán hàng', path: '/hk_care/sales/order' },
    // hk trading
    {
      breadcrumb: 'HK Trading',
      path: '/hk_trading',
    },
  ];
};

export default breadcrumbConfig;
