import CodeIcon from '@mui/icons-material/Code';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import useAuth from 'hooks/useAuth';
import useMounted from 'hooks/useMounted';
import { ReactNode, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { Role } from 'types/common';
import sleep from 'utils/sleep';
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
    title: 'Example',
    path: '/example/crud', //path need to be the same as route to be highlighted
    icon: <CodeIcon />,
    roles: ['hkl1'], //role user and admin can see this menu
  },
  {
    title: 'HK_Group',
    roles: ['hkl1', 'hkl2', 'hkl3', 'hkl2_1'],
    children: [
      {
        title: 'Quản lý sản phẩm',
        path: '/404',
        roles: ['hkl3'],
        children: [
          {
            title: 'Danh sách sản phẩm',
            path: '/404',
            roles: ['hkl3'],
          },
          {
            title: 'Loại sản phẩm',
            path: '/404',
            roles: ['hkl3'],
            children: [
              { title: 'Nhóm sản phẩm', path: '/404', roles: ['hkl3'] },
              { title: 'Dạng điều trị', path: '/404', roles: ['hkl3'] },
              {
                title: 'Dạng dùng',
                path: '/hk_group/san_pham/loai/dang_dung',
                roles: ['hkl3'],
              },
            ],
          },
          {
            title: 'Đơn vị đo lường',
            path: '/404',
            roles: ['hkl3'],
          },
          {
            title: 'Nhà cung cấp',
            path: '/404',
            roles: ['hkl3'],
          },
          {
            title: 'Giá tham chiếu',
            path: '/404',
            roles: ['hkl3'],
          },
        ],
      },
      {
        title: 'Thông tin điểm bán',
        path: '/404',
        roles: ['hkl2'],
      },
      {
        title: 'Quản trị người dùng',
        path: '/404',
        roles: ['hkl1', 'hkl2', 'hkl2_1'],
      },
    ],
  },
  {
    title: 'HK_Care',
    roles: ['hkl2_1', 'hkl2_1_1', 'hkl2_1_2', 'hkl2_1_3', 'hkl2_1_4'],
    children: [
      {
        title: 'Quản lý sản phẩm',
        path: '/404',
        roles: ['hkl2_1_1'],
        children: [
          {
            title: 'Danh sách sản phẩm',
            path: '/404',
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
                path: '/404',
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
            roles: [],
          },
          {
            title: 'Lập dự trù nhập kho',
            path: '/404',
            roles: [],
          },
          {
            title: 'Biên bản kiểm kê kho',
            path: '/404',
            roles: [],
          },
        ],
      },
      {
        title: 'Quản lý bán hàng',
        path: '/404',
        roles: ['hkl2_1_3'],
      },
      {
        title: 'Quản lý vận hành',
        path: '/404',
        roles: ['hkl2_1_4'],
        children: [
          {
            title: 'Danh sách nhân viên',
            path: '/404',
            roles: ['hkl2_1_3', 'hkl2_1_4'],
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
        roles: [],
      },
      {
        title: 'Kế hoạch phân phối',
        path: '/404',
        roles: [],
      },
    ],
  },
];

interface NavItemsProps {
  items: SectionItem[];
  pathname: string;
  depth?: number;
  role: Role;
}

const renderNavSectionItems = (props: NavItemsProps): JSX.Element => {
  const { depth = 0, items, role, pathname } = props;

  const itemsFiltered =
    depth === 0
      ? items.filter((item) => item.roles && item.roles.includes(role))
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
            return !roles || (roles && roles.includes(role));
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
                role,
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
  const { user } = useAuth();

  const sections = useMemo(() => getSections(), []);

  const role: Role = user?.userRole.code || 'empty';

  return (
    <Box sx={{ flexGrow: 1 }}>
      {renderNavSectionItems({
        items: sections,
        pathname: location.pathname,
        role,
      })}
    </Box>
  );
};

export default Sidebar;
