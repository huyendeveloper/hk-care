import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { LinkButton, LinkIconButton, Scrollbar } from 'components/common';
import { DeleteDialog } from 'components/Dialog';
import {
  TableContent,
  TablePagination,
  TableSearchField,
  TableWrapper,
} from 'components/Table';
import TableHeader, { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IUser } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { FilterParams } from 'types';

const getCells = (): Cells<IUser> => [
  { id: 'id', label: 'STT' },
  { id: 'name', label: 'Họ và tên' },
  { id: 'phone', label: 'Số điện thoại' },
  { id: 'role', label: 'Vai trò' },
  { id: 'status', label: 'Trạng thái' },
  { id: 'status', label: 'Thao tác' },
];

const getCellsAdminCare = (): Cells<IUser> => [
  { id: 'id', label: 'STT' },
  { id: 'name', label: 'Họ và tên' },
  { id: 'phone', label: 'Số điện thoại' },
  { id: 'role', label: 'Vai trò' },
  { id: 'tenant', label: 'Điểm bán' },
  { id: 'status', label: 'Trạng thái' },
  { id: 'status', label: 'Thao tác' },
];

const TableData = () => {
  const setNotification = useNotification();
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [currentID, setCurrentID] = useState<number | null>(null);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const [userList, setUserList] = useState<IUser[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [disableView, setDisableView] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const { userRoles } = useSelector((state: RootState) => state.auth);

  const cells = useMemo(
    () => (userRoles.includes('hkl2') ? getCellsAdminCare() : getCells()),
    [userRoles]
  );

  const fetchData = () => {
    setUserList([
      {
        id: 1,
        name: 'Jeth',
        phone: '7034887175',
        role: 'Electrician',
        tenant: 'Gigashots',
        status: false,
      },
      {
        id: 2,
        name: 'Edie',
        phone: '4611020964',
        role: 'Construction Expeditor',
        tenant: 'Skyble',
        status: false,
      },
      {
        id: 3,
        name: 'Nell',
        phone: '6794000846',
        role: 'Project Manager',
        tenant: 'Realbuzz',
        status: true,
      },
      {
        id: 4,
        name: 'Emelia',
        phone: '4652709644',
        role: 'Subcontractor',
        tenant: 'Eidel',
        status: false,
      },
      {
        id: 5,
        name: 'Edwin',
        phone: '3126986142',
        role: 'Construction Worker',
        tenant: 'Bluejam',
        status: false,
      },
      {
        id: 6,
        name: 'Nalani',
        phone: '8209306276',
        role: 'Construction Worker',
        tenant: 'Nlounge',
        status: true,
      },
      {
        id: 7,
        name: 'Nikkie',
        phone: '9837242081',
        role: 'Surveyor',
        tenant: 'Yamia',
        status: true,
      },
    ]);
    setTotalRows(33);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (searchText: string) => {
    setFilters((state) => ({
      ...state,
      searchText,
    }));
  };

  const handleOpenCreateDialog = () => {
    setCurrentID(null);
    setOpenFormDialog(true);
  };

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
    }));
  };

  const handleChangePage = (pageIndex: number) => {
    setFilters((state) => ({
      ...state,
      pageIndex,
    }));
  };

  const handleChangeRowsPerPage = (rowsPerPage: number) => {
    setFilters((state) => ({
      ...state,
      pageIndex: 1,
      pageSize: rowsPerPage,
    }));
  };

  const handleOpenDeleteDialog = (id: number) => () => {
    setCurrentID(id);
    setOpenDeleteDialog(true);
  };

  const handleOpenUpdateDialog = (id: number) => () => {
    setCurrentID(id);
    setOpenFormDialog(true);
    setDisableView(false);
  };

  const handleOpenViewDialog = (id: number) => () => {
    setCurrentID(id);
    setDisableView(true);
    setOpenFormDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    if (!currentID) return;
    handleCloseDeleteDialog();
    setShowBackdrop(true);
    // @ts-ignore
    const { error } = await dispatch(deleteUsage(currentID));
    if (error) {
      setNotification({ error: 'Lỗi!' });
      setShowBackdrop(false);
      return;
    }
    setNotification({
      message: 'Xóa thành công!',
      severity: 'success',
    });
    fetchData();
    setShowBackdrop(false);
  };

  const renderAction = (row: IUser) => {
    return (
      <>
        <LinkIconButton to={`${row.id}`}>
          <IconButton onClick={handleOpenViewDialog(row.id)}>
            <VisibilityIcon />
          </IconButton>
        </LinkIconButton>
        <LinkIconButton to={`${row.id}/update`}>
          <IconButton>
            <EditIcon />
          </IconButton>
        </LinkIconButton>
        {!row.status && (
          <IconButton onClick={handleOpenDeleteDialog(row.id)}>
            <DeleteIcon />
          </IconButton>
        )}
      </>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Danh sách người dùng"
        placeHolder="Tìm kiếm người dùng"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        <LinkButton
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{ fontSize: '1rem' }}
          to="create"
        >
          Thêm mới người dùng
        </LinkButton>
      </TableSearchField>
      <TableContent total={userList.length} loading={false}>
        <TableContainer sx={{ p: 1.5, maxHeight: '60vh' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 'max-content' }} size="small">
              <TableHeader
                cells={cells}
                onSort={handleOnSort}
                sortDirection={filters.sortDirection}
                sortBy={filters.sortBy}
              />

              <TableBody>
                {userList.map((item, index) => {
                  const { id, name, phone, role, tenant, status } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{phone}</TableCell>
                      <TableCell>{role}</TableCell>
                      {userRoles.includes('hkl2') && (
                        <TableCell>{tenant}</TableCell>
                      )}
                      <TableCell>
                        {status ? (
                          <Button>Hoạt động</Button>
                        ) : (
                          <Button color="error">Không hoạt động</Button>
                        )}
                      </TableCell>
                      <TableCell align="left">{renderAction(item)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePagination
          pageIndex={filters.pageIndex}
          totalPages={totalRows}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          rowsPerPage={filters.pageSize}
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
        />

        <DeleteDialog
          id={currentID}
          tableName="người dùng"
          name={userList.find((x) => x.id === currentID)?.name}
          onClose={handleCloseDeleteDialog}
          open={openDeleteDialog}
          handleDelete={handleDelete}
        />
      </TableContent>
    </TableWrapper>
  );
};

export default TableData;
