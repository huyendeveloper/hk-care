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
        children: [
          {
            title: 'Danh sách người dùng',
            path: '/hk_group/operate/users',
            roles: ['hkl1', 'hkl2'],
          },
          {
            title: 'Phân quyền',
            path: '/hk_group/operate/roles',
            roles: ['hkl1'],
          },
        ],
      },
    ],
  },
  {
    title: LocalStorage.get('tennant'),
    roles: ['hkl2_1', 'hkl2_1_1', 'hkl2_1_2', 'hkl2_1_3', 'hkl2_1_4'],
    children: [
      {
        title: 'Danh sách sản phẩm',
        path: '/hk_care/product/list',
        roles: ['hkl2_1_1'],
      },
      {
        title: 'Quản lý kho',
        path: '/404',
        roles: ['hkl2_1_2'],
        children: [
          {
            title: 'Nhập kho',
            path: '/hk_care/warehouse/import/receipt',
            roles: ['hkl2_1_2'],
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
            title: 'Yêu cầu nhập hàng',
            path: '/hk_care/warehouse/request',
            roles: ['hkl2_1_2'],
          },
          {
            title: 'Biên bản kiểm kê kho',
            path: '/hk_care/warehouse/inventory_record',
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
            title: 'Bán hàng',
            path: '/hk_care/sales/order/create',
            roles: ['hkl2_1_3'],
          },
          {
            title: 'Danh sách hóa đơn',
            path: '/hk_care/sales/order',
            roles: ['hkl2_1_3'],
          },
        ],
      },
      {
        title: 'Quản lý vận hành',
        path: '/404',
        roles: ['hkl2_1_4', 'hkl2_1'],
        children: [
          {
            title: 'Danh sách nhân viên',
            path: '/hk_care/operate/staff',
            roles: ['hkl2_1_3', 'hkl2_1_4', 'hkl2_1'],
          },
          {
            title: 'Phân quyền',
            path: '/hk_care/operate/roles',
            roles: ['hkl2_1'],
          },
        ],
      },
      {
        title: 'Báo cáo',
        path: '/404',
        roles: ['hkl2_1'],
        children: [
          {
            title: 'Báo cáo doanh thu nhà thuốc',
            path: '/hk_care/sales_statistical/sales_report',
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
        path: '/hk_trading/request',
        roles: ['hkl4'],
      },
      // {
      //   title: 'Kế hoạch nhập kho',
      //   path: '/404',
      //   roles: ['hkl4'],
      // },
      // {
      //   title: 'Kế hoạch phân phối',
      //   path: '/404',
      //   roles: ['hkl4'],
      // },
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
