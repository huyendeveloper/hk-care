import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
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
  Tooltip
} from '@mui/material';
import { LinkIconButton, Scrollbar } from 'components/common';
import { BlockDialog, DeleteDialog, UnBlockDialog } from 'components/Dialog';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableSearchField,
  TableWrapper
} from 'components/Table';
import type { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { ISupplier } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeStatus,
  deleteSupplier,
  getAllSupplier
} from 'redux/slices/supplier';
import { RootState } from 'redux/store';
import { ClickEventCurrying } from 'types';
import type { FilterParams } from 'types/common';
import FormDialogSupplier from '../FormDialog';

const getCells = (): Cells<ISupplier> => [
  { id: 'id', label: 'STT' },
  { id: 'name', label: 'Tên nhà cung cấp' },
  { id: 'address', label: 'Địa chỉ' },
  { id: 'nameContact', label: 'Người liên hệ' },
  { id: 'telephoneNumber', label: 'Số điện thoại' },
  { id: 'active', label: 'Trạng thái' },
  { id: 'active', label: 'Thao tác' },
];

const TableData = () => {
  const setNotification = useNotification();
  const [currentID, setCurrentID] = useState<number | null>(null);
  const [supplierList, setSupplierList] = useState<ISupplier[]>([]);
  const [openBlockDialog, setOpenBlockDialog] = useState<boolean>(false);
  const [openUnBlockDialog, setOpenUnBlockDialog] = useState<boolean>(false);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const { loading } = useSelector((state: RootState) => state.supplier);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const dispatch = useDispatch();
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getAllSupplier(filters));

    if (error) {
      setNotification({
        error: 'Lỗi khi tải danh sách nhà cung cấp!',
      });
      return;
    }

    setSupplierList(payload.supplierList);
    setTotalRows(payload.totalCount);
  };

  useEffect(() => {
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

  const handleCloseFormDialog = (updated: boolean | undefined) => {
    setOpenFormDialog(false);
    if (updated) {
      fetchData();
    }
  };

  const handleBlock = async () => {
    if (!currentID) return;
    handleCloseBlockDialog();
    const { error } = await dispatch(
      // @ts-ignore
      changeStatus({ id: currentID, status: 2 })
    );
    if (error) {
      setNotification({ error: 'Lỗi khi vô hiệu hóa nhà cung cấp này!' });
      return;
    }
    setNotification({
      message: 'Vô hiệu hóa thành công!',
      severity: 'success',
    });

    fetchData();
  };

  const handleUnBlock = async () => {
    if (!currentID) return;
    handleCloseUnBlockDialog();
    const { error } = await dispatch(
      // @ts-ignore
      changeStatus({ id: currentID, status: 1 })
    );
    if (error) {
      setNotification({
        error: 'Lỗi khi kích hoạt hoạt động nhà cung cấp này!',
      });
      return;
    }
    setNotification({
      message: 'Kích hoạt thành công!',
      severity: 'success',
    });

    fetchData();
  };

  const handleOpenDeleteDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    if (!currentID) return;
    handleCloseDeleteDialog();
    // @ts-ignore
    const { error } = await dispatch(deleteSupplier(currentID));
    if (error) {
      setNotification({ error: 'Lỗi khi xóa nhà cung cấp!' });
      return;
    }
    setNotification({
      message: 'Xóa thành công!',
      severity: 'success',
    });

    setSupplierList(supplierList.filter((x) => x.id !== currentID));
  };

  const renderAction = (row: ISupplier) => {
    return (
      <>
        <LinkIconButton to={`${row.id}`}>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </LinkIconButton>

        <IconButton onClick={handleOpenUpdateDialog(row.id)}>
          <EditIcon />
        </IconButton>

        {row.active === 1 ? (
          <IconButton onClick={handleOpenBlockDialog(row.id)}>
            <BlockIcon />
          </IconButton>
        ) : (
          <>
            <IconButton onClick={handleOpenUnBlockDialog(row.id)}>
              <CheckIcon />
            </IconButton>
            <IconButton onClick={handleOpenDeleteDialog(row.id)}>
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Danh sách nhà cung cấp"
        placeHolder="Tìm kiếm nhà cung cấp"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          sx={{ fontSize: '1rem' }}
        >
          Thêm mới nhà cung cấp
        </Button>
      </TableSearchField>

      <TableContent total={supplierList.length} loading={loading}>
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
                {supplierList.map((item, index) => {
                  const {
                    id,
                    name,
                    address,
                    nameContact,
                    telephoneNumber,
                    active,
                  } = item;

                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{name}</TableCell>
                      {/* @ts-ignore */}
                      <Tooltip title={address} placement="bottom">
                        <TableCell
                          sx={{
                            maxWidth: '240px',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                          }}
                        >
                          {address}
                        </TableCell>
                      </Tooltip>

                      <TableCell>{nameContact}</TableCell>
                      <TableCell>{telephoneNumber}</TableCell>
                      <TableCell>
                        {active === 1 ? (
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
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </TableContent>

      <BlockDialog
        id={currentID}
        tableName="nhà cung cấp"
        name={supplierList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseBlockDialog}
        open={openBlockDialog}
        handleBlock={handleBlock}
      />

      <UnBlockDialog
        id={currentID}
        tableName="nhà cung cấp"
        name={supplierList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseUnBlockDialog}
        open={openUnBlockDialog}
        handleUnBlock={handleUnBlock}
      />

      <DeleteDialog
        id={currentID}
        tableName="nhà cung cấp"
        name={supplierList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        handleDelete={handleDelete}
      />

      <FormDialogSupplier
        currentID={currentID}
        data={supplierList.find((x) => x.id === currentID)}
        open={openFormDialog}
        handleClose={handleCloseFormDialog}
      />
    </TableWrapper>
  );
};

export default TableData;
