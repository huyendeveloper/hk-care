import {
  Backdrop,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { Scrollbar } from 'components/common';
import { DeleteDialog } from 'components/Dialog';
import { TableContent, TableWrapper } from 'components/Table';
import TableHeader, { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IRole } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import userService from 'services/user.service';
import { FilterParams } from 'types';
import Role from './Role';

const getCells = (): Cells<IRole> => [
  {
    id: 'roleName',
    label: 'Vai trò',
  },
  {
    id: 'qlvh',
    label: 'Quản lý điểm bán',
  },
  {
    id: 'qlsp',
    label: 'Quản trị người dùng',
  },
  {
    id: 'qlkh',
    label: 'Quản lý sản phẩm hệ thống',
  },
  {
    id: 'qlbh',
    label: 'Quản lý kho tổng',
  },

  {
    id: 'qlvh',
    label: '',
  },
];

interface IPermission {
  key: string;
  name: string;
  isGrant: boolean;
}

const TableData = () => {
  const setNotification = useNotification();
  const [roles, setRoles] = useState<IRole[]>([]);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [loading, setLoading] = useState<boolean>(false); //true
  const [permission, setPermission] = useState<IPermission[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [currentID, setCurrentID] = useState<string | null>(null);
  const [showBackdropDelete, setShowBackdropDelete] = useState<boolean>(false);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);

  const cells = useMemo(() => getCells(), []);

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
    }));
  };

  const fetchData = async () => {
    try {
      const { data } = await userService.loadRoleConvert();
      setPermission(data);
      const res = await userService.getAllRoles();

      const roleList = res?.data
        ? // @ts-ignore
          res.data.map((item) => ({
            idRole: item.idRole,
            roleName: item.roleName,
            roleKey: item.roleKey,
            qlsp:
              // @ts-ignore
              item.permissionDtos.find((x) => x?.key === data[0].key)
                ? // @ts-ignore
                  item.permissionDtos.find((x) => x?.key === data[0].key)
                    .isGrant
                : false,
            qlkh:
              // @ts-ignore
              item.permissionDtos.find((x) => x?.key === data[1].key)
                ? // @ts-ignore
                  item.permissionDtos.find((x) => x?.key === data[1].key)
                    .isGrant
                : false,
            qlbh:
              // @ts-ignore
              item.permissionDtos.find((x) => x?.key === data[2].key)
                ? // @ts-ignore
                  item.permissionDtos.find((x) => x?.key === data[2].key)
                    .isGrant
                : false,
            qlvh:
              // @ts-ignore
              item.permissionDtos.find((x) => x?.key === data[3].key)
                ? // @ts-ignore
                  item.permissionDtos.find((x) => x?.key === data[3].key)
                    .isGrant
                : false,
          }))
        : [];

      setRoles(
        roleList.length > 0
          ? roleList
          : [
              {
                roleName: '',
                roleKey: undefined,
                qlsp: false,
                qlkh: false,
                qlbh: false,
                qlvh: false,
              },
            ]
      );
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const handleOpenDeleteDialog = (id: string | null) => {
    setCurrentID(id);
    setOpenDeleteDialog(true);
  };

  const handleAddItem = () => {
    const newRoles: IRole = {
      roleName: '',
      roleKey: undefined,
      qlsp: false,
      qlkh: false,
      qlbh: false,
      qlvh: false,
    };
    setRoles([...roles, newRoles]);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    setShowBackdropDelete(true);
    if (!currentID) return;
    handleCloseDeleteDialog();
    const role = roles.filter((x) => (x.roleKey = currentID));
    const newRole = role.map((item) => {
      const newPermission = [...permission];
      newPermission[0].isGrant = item.qlsp;
      newPermission[1].isGrant = item.qlkh;
      newPermission[2].isGrant = item.qlbh;
      newPermission[3].isGrant = item.qlvh;
      const newRole = {
        roleKey: item.roleKey,
        roleName: item.roleName,
        status: false,
        permissionDtos: newPermission,
      };

      return newRole;
    });

    // @ts-ignore
    await userService.processRoleAdmin([newRole[0]]);
    fetchData();
    window.location.reload();
    setShowBackdropDelete(false);
  };

  return (
    <TableWrapper sx={{ height: 1, p: 1.5 }} component={Paper}>
      <TableContent total={roles.length} loading={loading}>
        <TableContainer sx={{ p: 1.5 }}>
          <Scrollbar>
            <Table sx={{ minWidth: 'max-content' }} size="small">
              <TableHeader
                cells={cells}
                onSort={handleOnSort}
                sortDirection={filters.sortDirection}
                sortBy={filters.sortBy}
              />

              <TableBody>
                {roles.map((item, index) => {
                  return (
                    <Role
                      role={item}
                      key={index}
                      index={index + 1}
                      handleOpenDeleteDialog={handleOpenDeleteDialog}
                      addItem={index + 1 === roles.length}
                      handleAddItem={handleAddItem}
                      permission={permission}
                      setShowBackdrop={setShowBackdrop}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </TableContent>

      <DeleteDialog
        id={currentID}
        tableName="vai trò"
        name={roles.find((x) => x.roleKey === currentID)?.roleName}
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        handleDelete={handleDelete}
        loading={showBackdropDelete}
      />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </TableWrapper>
  );
};

export default TableData;
