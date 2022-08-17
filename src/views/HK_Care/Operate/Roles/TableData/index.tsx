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
import { IRole } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import userService from 'services/user.service';
import { FilterParams } from 'types';
import { isJSDocReturnTag } from 'typescript';
import Role from './Role';

const getCells = (): Cells<IRole> => [
  {
    id: 'roleName',
    label: 'Vai trò',
  },
  {
    id: 'qlsp',
    label: 'QLSP',
  },
  {
    id: 'qlkh',
    label: 'QLKH',
  },
  {
    id: 'qlbh',
    label: 'QLBH',
  },
  {
    id: 'qlvh',
    label: 'QLVH',
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
  const [roles, setRoles] = useState<IRole[]>([]);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [loading, setLoading] = useState<boolean>(false); //true
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [permission, setPermission] = useState<IPermission[]>([]);
  const [currentID, setCurrentID] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [showBackdropDelete, setShowBackdropDelete] = useState<boolean>(false);

  const cells = useMemo(() => getCells(), []);

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
    }));
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    setShowBackdrop(true);
    if (!currentID) return;
    handleCloseDeleteDialog();
    const role = roles.find((x) => (x.idRole = currentID));
    if (!role?.idRole) {
      return;
    }
    const newRole = {
      roleId: role.idRole,
      roleName: null,
    };

    // @ts-ignore
    const { data } = await userService.changeSalePointPermission(newRole);
    fetchData();
    setShowBackdrop(false);
    window.location.reload();
  };

  const fetchData = async () => {
    try {
      const { data } = await userService.getPermissionSalePoint();
      setPermission(data);
      const res = await userService.getPermissionDefault();

      const roleList = res?.data
        ? // @ts-ignore
          res.data.map((item) => {
            return {
              idRole: item.roleId,
              roleName: item.roleName,
              qlsp:
                item.grantPermissionDtos.find(
                  // @ts-ignore
                  (x) => x?.permissionName === data[0].permissionName
                ).isGrant || false,
              qlkh:
                item.grantPermissionDtos.find(
                  // @ts-ignore
                  (x) => x?.permissionName === data[1].permissionName
                ).isGrant || false,
              qlbh:
                item.grantPermissionDtos.find(
                  // @ts-ignore
                  (x) => x?.permissionName === data[2].permissionName
                ).isGrant || false,
              qlvh:
                item.grantPermissionDtos.find(
                  // @ts-ignore
                  (x) => x?.permissionName === data[3].permissionName
                ).isGrant || false,
            };
          })
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

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const handleOpenDeleteDialog = (id: string | null) => {
    setCurrentID(id);
    setOpenDeleteDialog(true);
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
