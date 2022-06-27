import { FC, ReactNode, useEffect, useMemo } from 'react';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from 'redux/store';
import { Role } from 'types';
import LocalStorage from 'utils/LocalStorage';

interface SectionItem {
  title: string;
  children?: SectionItem[];
  info?: () => JSX.Element | null;
  icon?: ReactNode;
  path?: string;
  roles?: Role[];
}

const getSections = (): SectionItem[] => [
  {
    title: 'HK_Group',
    roles: ['hkl1', 'hkl2', 'hkl3'],
    children: [
      {
        title: 'Quản lý sản phẩm',
        path: '/404',
        roles: ['hkl3'],
        children: [
          {
            title: 'Danh sách sản phẩm',
            path: '/hk_group/product/list',
            roles: ['hkl3'],
          },
          {
            title: 'Loại sản phẩm',
            path: '/404',
            roles: ['hkl3'],
            children: [
              {
                title: 'Nhóm sản phẩm',
                path: '/hk_group/product/type/product_group',
                roles: ['hkl3'],
              },
              {
                title: 'Nhóm điều trị',
                path: '/hk_group/product/type/treatment_group',
                roles: ['hkl3'],
              },
              {
                title: 'Dạng dùng',
                path: '/hk_group/product/type/usage',
                roles: ['hkl3'],
              },
            ],
          },
          {
            title: 'Đơn vị đo lường',
            path: '/hk_group/product/measure',
            roles: ['hkl3'],
          },
          {
            title: 'Nhà cung cấp',
            path: '/hk_group/product/supplier',
            roles: ['hkl3'],
          },
          {
            title: 'Giá tham chiếu',
            path: '/hk_group/product/reference_prices',
            roles: ['hkl3'],
          },
        ],
      },
      {
        title: 'Thông tin điểm bán',
        path: '/hk_group/tenant',
        roles: ['hkl2'],
      },
      {
        title: 'Quản trị người dùng',
        path: '/404',
        roles: ['hkl1', 'hkl2'],
      },
    ],
  },
  {
    title: LocalStorage.get('tennant'),
    roles: ['hkl2_1', 'hkl2_1_1', 'hkl2_1_2', 'hkl2_1_3', 'hkl2_1_4'],
    children: [
      {
        title: 'Quản lý sản phẩm',
        path: '/404',
        roles: ['hkl2_1_1'],
        children: [
          {
            title: 'Danh sách sản phẩm',
            path: '/hk_care/product/list',
            roles: ['hkl2_1_1'],
          },
          {
            title: 'Định mức lưu trữ',
            path: '/404',
            roles: ['hkl2_1_1'],
          },
        ],
      },
      {
        title: 'Quản lý kho',
        path: '/404',
        roles: ['hkl2_1_2'],
        children: [
          {
            title: 'Nhập kho',
            path: '/404',
            roles: ['hkl2_1_2'],
            children: [
              {
                title: 'Hoá đơn nhập kho',
                path: '/hk_care/warehouse/import/receipt',
                roles: ['hkl2_1_2'],
              },
              {
                title: 'Biên bản nhập kho',
                path: '/404',
                roles: ['hkl2_1_2'],
              },
            ],
          },
          {
            title: 'Xuất kho',
            path: '/404',
            roles: ['hkl2_1_2'],
            children: [
              {
                title: 'Xuất hủy',
                path: '/hk_care/warehouse/export/cancel',
                roles: ['hkl2_1_2'],
              },
              {
                title: 'Xuất luân chuyển',
                path: '/hk_care/warehouse/export/circulation_invoice',
                roles: ['hkl2_1_2'],
              },
            ],
          },
          {
            title: 'Lập dự trù nhập kho',
            path: '/404',
            roles: ['hkl2_1_2'],
          },
          {
            title: 'Biên bản kiểm kê kho',
            path: '/404',
            roles: ['hkl2_1_2'],
          },
        ],
      },
      {
        title: 'Quản lý bán hàng',
        path: '/404',
        roles: ['hkl2_1_3'],
        children: [
          {
            title: 'Hóa đơn bán hàng',
            path: '/hk_care/sales/order',
            roles: ['hkl2_1_3'],
          },
          {
            title: 'Danh sách khách hàng',
            path: '/404',
            roles: ['hkl2_1_3'],
          },
        ],
      },
      {
        title: 'Quản lý vận hành',
        path: '/404',
        roles: ['hkl2_1_4', 'hkl2_1_1', 'hkl2_1'],
        children: [
          {
            title: 'Danh sách nhân viên',
            path: '/404',
            roles: ['hkl2_1_3', 'hkl2_1_1', 'hkl2_1_4', 'hkl2_1'],
          },
        ],
      },
      {
        title: 'Báo cáo/Thống kê (Tại điểm bán)',
        path: '/404',
        roles: ['hkl2_1'],
        children: [
          {
            title: 'Báo cáo doanh thu nhà thuốc',
            path: '/404',
            roles: ['hkl2_1'],
          },
        ],
      },
    ],
  },
  {
    title: 'HK_Trading',
    roles: ['hkl4'],
    children: [
      {
        title: 'Tổng hợp yêu cầu nhập',
        path: '/404',
        roles: ['hkl4'],
      },
      {
        title: 'Kế hoạch nhập kho',
        path: '/404',
        roles: ['hkl4'],
      },
      {
        title: 'Kế hoạch phân phối',
        path: '/404',
        roles: ['hkl4'],
      },
    ],
  },
];

const PrivateRoute: FC = ({ children }) => {
  const auth = useSelector((state: RootState) => state.auth);
  // const location = useLocation();
  // let match = false;

  const { isAuthenticated } = auth;

  // const sections = useMemo(() => getSections(), []);

  // const itemsFiltered = sections.filter(
  //   (item) => item.roles && item.roles.some((r) => auth.userRoles.includes(r))
  // );

  // const checkMath = (items: SectionItem[]) => {
  //   items.forEach((item: SectionItem) => {
  //     const partialMatch = location.pathname.startsWith(String(item.path));

  //     if (partialMatch) {
  //       match = true;
  //     }
  //     if (item.children) {
  //       checkMath(item.children);
  //     }
  //   });
  // };

  // checkMath(itemsFiltered);

  // if (
  //   (location.pathname === '/' && isAuthenticated) ||
  //   (location.pathname === '/login' && !isAuthenticated)
  // ) {
  //   match = true;
  // }

  // useEffect(() => {}, [itemsFiltered]);

  // if (!match) {
  //   return <Navigate to="/" replace />;
  // }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Fragment>{children}</Fragment>;
};

export default PrivateRoute;
