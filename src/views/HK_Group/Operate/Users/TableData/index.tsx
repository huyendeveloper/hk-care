import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Backdrop,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import {
  LinkButton,
  LinkIconButton,
  LoadingScreen,
  Scrollbar,
} from 'components/common';
import { BlockDialog, UnBlockDialog } from 'components/Dialog';
import {
  TableContent,
  TablePagination,
  TableSearchField,
  TableWrapper,
} from 'components/Table';
import TableBodyContent from 'components/Table/TableBodyContent';
import TableHeader, { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IUser } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeStatusUser } from 'redux/slices/staff';
import { getAllUser } from 'redux/slices/user';
import { RootState } from 'redux/store';
import { ClickEventCurrying, FilterParams } from 'types';

const getCells = (): Cells<IUser> => [
  { id: 'id', label: 'STT' },
  { id: 'name', label: 'Họ và tên' },
  { id: 'phone', label: 'Số điện thoại' },
  { id: 'roleId', label: 'Vai trò' },
  { id: 'isActive', label: 'Trạng thái' },
  { id: 'isActive', label: 'Thao tác' },
];

const getCellsAdminCare = (): Cells<IUser> => [
  { id: 'id', label: 'STT' },
  { id: 'name', label: 'Họ và tên' },
  { id: 'phone', label: 'Số điện thoại' },
  { id: 'roleId', label: 'Vai trò' },
  // { id: 'tenant', label: 'Điểm bán' },
  { id: 'isActive', label: 'Trạng thái' },
  { id: 'isActive', label: 'Thao tác' },
];

const TableData = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [currentID, setCurrentID] = useState<number | null>(null);
  const [userList, setUserList] = useState<IUser[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [openBlockDialog, setOpenBlockDialog] = useState<boolean>(false);
  const [openUnBlockDialog, setOpenUnBlockDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);

  const { userRoles } = useSelector((state: RootState) => state.auth);

  const cells = useMemo(
    () => (userRoles.includes('hkl2') ? getCellsAdminCare() : getCells()),
    [userRoles]
  );

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getAllUser(filters));
    if (error) {
      setNotification({
        error: 'Hệ thống đang gặp sự cố',
      });
      setLoading(false);
      return;
    }
    setUserList(payload.userList);
    setTotalRows(payload.totalCount);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [filters]);

  const handleSearch = (searchText: string) => {
    setFilters((state) => ({
      ...state,
      searchText,
    }));
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

  const handleOpenBlockDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenBlockDialog(true);
  };

  const handleOpenUnBlockDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenUnBlockDialog(true);
  };

  const handleCloseBlockDialog = () => {
    setOpenBlockDialog(false);
  };

  const handleCloseUnBlockDialog = () => {
    setOpenUnBlockDialog(false);
  };

  const handleBlock = async () => {
    if (!currentID) return;
    handleCloseBlockDialog();
    setShowBackdrop(true);
    const { error } = await dispatch(
      // @ts-ignore
      changeStatusUser({ id: currentID })
    );
    if (error) {
      setNotification({ error: 'Hệ thống đang gặp sự cố' });
      setShowBackdrop(false);
      return;
    }
    setNotification({
      message: 'Vô hiệu hóa thành công!',
      severity: 'success',
    });
    fetchData();
    setShowBackdrop(false);
  };

  const handleUnBlock = async () => {
    if (!currentID) return;
    handleCloseUnBlockDialog();
    setShowBackdrop(true);
    const { error } = await dispatch(
      // @ts-ignore
      changeStatusUser({ id: currentID })
    );
    if (error) {
      setNotification({ error: 'Hệ thống đang gặp sự cố' });
      setShowBackdrop(false);
      return;
    }
    setNotification({
      message: 'Kích hoạt thành công!',
      severity: 'success',
    });

    fetchData();
    setShowBackdrop(false);
  };

  const renderAction = (row: IUser) => {
    return (
      <>
        <LinkIconButton to={`${row.id}`}>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </LinkIconButton>
        <LinkIconButton to={`${row.id}/update`}>
          <IconButton>
            <EditIcon />
          </IconButton>
        </LinkIconButton>

        {row.isActive ? (
          <IconButton onClick={handleOpenBlockDialog(row.id)}>
            <BlockIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handleOpenUnBlockDialog(row.id)}>
            <CheckIcon />
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
              <TableBodyContent
                total={userList.length}
                loading={loading}
                colSpan={cells.length}
              >
                {userList.map((item, index) => {
                  const { id, name, phone, roleName, tenant, role, isActive } =
                    item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{phone}</TableCell>
                      {/* <TableCell>{roleName}</TableCell> */}
                      <TableCell>{role[0]}</TableCell>
                      {/* {userRoles.includes('hkl2') && (
                        <TableCell>{tenant}</TableCell>
                      )} */}
                      <TableCell>
                        {isActive ? (
                          <Button>Hoạt động</Button>
                        ) : (
                          <Button color="error">Dừng hoạt động</Button>
                        )}
                      </TableCell>
                      <TableCell align="left">{renderAction(item)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBodyContent>
            </TableBody>
          </Table>
        </Scrollbar>
        {loading && <LoadingScreen />}
      </TableContainer>

      <TablePagination
        pageIndex={filters.pageIndex}
        totalPages={totalRows}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={filters.pageSize}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />

      <BlockDialog
        id={currentID}
        tableName="người dùng"
        name={userList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseBlockDialog}
        open={openBlockDialog}
        handleBlock={handleBlock}
      />

      <UnBlockDialog
        id={currentID}
        tableName="người dùng"
        name={userList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseUnBlockDialog}
        open={openUnBlockDialog}
        handleUnBlock={handleUnBlock}
      />

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBackdrop}
        onClick={() => setShowBackdrop(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </TableWrapper>
  );
};

export default TableData;
