import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
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
import { LinkButton, LinkIconButton, Scrollbar } from 'components/common';
import { BlockDialog, DeleteDialog, UnBlockDialog } from 'components/Dialog';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableSearchField,
  TableWrapper,
} from 'components/Table';
import type { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IStaff } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeStatus, deleteProduct } from 'redux/slices/product';
import { ClickEventCurrying } from 'types';
import type { FilterParams } from 'types/common';

const getCells = (): Cells<IStaff> => [
  { id: 'id', label: 'STT' },
  { id: 'id', label: 'Họ và tên' },
  { id: 'id', label: 'Vai trò' },
  { id: 'id', label: 'Số điện thoại' },
  { id: 'id', label: 'Trạng thái' },
  { id: 'id', label: 'Thao tác' },
];

const TableData = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();

  const [currentID, setCurrentID] = useState<number | null>(null);
  const [staffList, setStaffList] = useState<IStaff[]>([]);
  const [openBlockDialog, setOpenBlockDialog] = useState<boolean>(false);
  const [openUnBlockDialog, setOpenUnBlockDialog] = useState<boolean>(false);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterParams>({
    ...defaultFilters,
  });

  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    const payload = {
      staffList: [
        {
          id: 1,
          name: 'Robin',
          roleName: 'Construction Manager',
          phone: '990-885-5285',
          active: true,
        },
        {
          id: 2,
          name: 'Kelsey',
          roleName: 'Construction Worker',
          phone: '868-762-7860',
          active: true,
        },
        {
          id: 3,
          name: 'Melinde',
          roleName: 'Estimator',
          phone: '155-768-2115',
          active: true,
        },
        {
          id: 4,
          name: 'Loraine',
          roleName: 'Construction Worker',
          phone: '961-799-9531',
          active: false,
        },
        {
          id: 5,
          name: 'Chantal',
          roleName: 'Construction Foreman',
          phone: '995-621-9786',
          active: true,
        },
        {
          id: 6,
          name: 'Welby',
          roleName: 'Electrician',
          phone: '851-828-7907',
          active: true,
        },
        {
          id: 7,
          name: 'Christel',
          roleName: 'Construction Worker',
          phone: '451-372-5746',
          active: false,
        },
        {
          id: 8,
          name: 'Raquel',
          roleName: 'Construction Foreman',
          phone: '365-959-1171',
          active: true,
        },
        {
          id: 9,
          name: 'Shepperd',
          roleName: 'Engineer',
          phone: '189-360-7997',
          active: true,
        },
        {
          id: 10,
          name: 'Karyn',
          roleName: 'Construction Foreman',
          phone: '147-743-1083',
          active: false,
        },
      ],
      totalCount: 15,
    };
    // @ts-ignore
    // const { payload, error } = await dispatch(getAllProduct(filters));

    // if (error) {
    //   setNotification({ error: 'Lỗi!' });
    //   setLoading(false);
    //   return;
    // }
    setStaffList(payload.staffList);
    setTotalRows(payload.totalCount);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

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

  const handleDelete = async () => {
    if (!currentID) return;
    handleCloseDeleteDialog();
    setShowBackdrop(true);
    // @ts-ignore
    const { error } = await dispatch(deleteProduct(currentID));
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

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

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

  const handleOpenUpdateDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenFormDialog(true);
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
      changeStatus({ id: currentID, status: true })
    );
    if (error) {
      setNotification({ error: 'Lỗi!' });
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
      changeStatus({ id: currentID, status: false })
    );
    if (error) {
      setNotification({ error: 'Lỗi!' });
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

  const handleOpenDeleteDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenDeleteDialog(true);
  };

  const renderAction = (row: IStaff) => {
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

        {!row.active && (
          <IconButton onClick={handleOpenDeleteDialog(row.id)}>
            <DeleteIcon />
          </IconButton>
        )}
      </>
    );
  };

  return (
    <TableWrapper sx={{ height: 1, minHeight: '60vh' }} component={Paper}>
      <TableSearchField
        title="Danh sách nhân viên"
        placeHolder="Tìm kiếm nhân viên"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        <LinkButton
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{ fontSize: '1rem' }}
          to="create"
        >
          Thêm nhân viên
        </LinkButton>
      </TableSearchField>

      <TableContent total={staffList.length} loading={loading}>
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
                {staffList.map((item, index) => {
                  const { id, name, roleName, phone, active } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{roleName}</TableCell>
                      <TableCell>{phone}</TableCell>
                      <TableCell>
                        {active ? (
                          <Button>Đang làm việc</Button>
                        ) : (
                          <Button color="error">Đã nghỉ làm</Button>
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
      </TableContent>

      <BlockDialog
        id={currentID}
        tableName="nhân viên"
        name={staffList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseBlockDialog}
        open={openBlockDialog}
        handleBlock={handleBlock}
      />

      <UnBlockDialog
        id={currentID}
        tableName="nhân viên"
        name={staffList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseUnBlockDialog}
        open={openUnBlockDialog}
        handleUnBlock={handleUnBlock}
      />

      <DeleteDialog
        id={currentID}
        tableName="nhân viên"
        name={staffList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        handleDelete={handleDelete}
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
