import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { ReactNode, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from 'redux/store';
import type { Role } from 'types/common';
import LocalStorage from 'utils/LocalStorage';
import SidebarItem from './SidebarItem';

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
            path: '/404',
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
      {
        title: 'Quản lý nhà cung cấp',
        path: '/hk_trading/supplier',
        roles: ['hkl4'],
      },
    ],
  },
];

interface NavItemsProps {
  items: SectionItem[];
  pathname: string;
  depth?: number;
  roleUser: string[];
}

const renderNavSectionItems = (props: NavItemsProps): JSX.Element => {
  const { depth = 0, items, roleUser, pathname } = props;

  const itemsFiltered =
    depth === 0
      ? items.filter(
          (item) => item.roles && item.roles.some((r) => roleUser.includes(r))
        )
      : items;

  return (
    <List disablePadding>
      {itemsFiltered.reduce((acc: JSX.Element[], item) => {
        const { children, icon, info, path, title } = item;
        const key = `${title}-${depth}`;
        const partialMatch = pathname.startsWith(String(path));
        // const exactMatch = pathname === item.path;
        if (children) {
          const items = children.filter((item) => {
            const { roles } = item;
            return !roles || (roles && roles.some((r) => roleUser.includes(r)));
          });
          acc.push(
            <SidebarItem
              key={key}
              icon={icon}
              info={info}
              path={path}
              title={title}
              depth={depth}
              open={partialMatch}
              active={partialMatch}
            >
              {renderNavSectionItems({
                depth: depth + 1,
                items,
                pathname,
                roleUser,
              })}
            </SidebarItem>
          );
        } else {
          acc.push(
            <SidebarItem
              key={key}
              icon={icon}
              info={info}
              path={path}
              title={title}
              depth={depth}
              active={partialMatch}
            />
          );
        }

        return acc;
      }, [])}
    </List>
  );
};

const Sidebar = () => {
  const location = useLocation();

  const sections = useMemo(() => getSections(), []);
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {renderNavSectionItems({
        items: sections,
        pathname: location.pathname,
        roleUser: auth.userRoles,
      })}
    </Box>
  );
};

export default Sidebar;
