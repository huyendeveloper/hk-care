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
import { LinkIconButton, Scrollbar } from 'components/common';
import { DeleteDialog } from 'components/Dialog';
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
import { IUsage } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUsage, getAllUsage } from 'redux/slices/usage';
import { RootState } from 'redux/store';
import usageService from 'services/usage.service';
import { ClickEventCurrying } from 'types';
import type { FilterParams } from 'types/common';
import FormDialog from '../FormDialog';

const getCells = (): Cells<IUsage> => [
  {
    id: 'id',
    label: 'STT',
  },
  {
    id: 'name',
    label: 'Tên dạng dùng',
  },
  {
    id: 'description',
    label: 'Thao tác',
  },
];

const TableData = () => {
  const setNotification = useNotification();
  const [disableView, setDisableView] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [currentID, setCurrentID] = useState<number | null>(null);
  const [usageList, setUsageList] = useState<IUsage[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const [totalRows, setTotalRows] = useState<number>(0);
  const { loading } = useSelector((state: RootState) => state.usage);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);

  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getAllUsage(filters));

    if (error) {
      setNotification({
        error: 'Lỗi khi tải danh sách dạng dùng!',
      });
      return;
    }

    setUsageList(payload.usageList);
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

  const handleOpenViewDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setDisableView(true);
    setOpenFormDialog(true);
  };

  const handleOpenCreateDialog = () => {
    setCurrentID(null);
    setOpenFormDialog(true);
    setDisableView(false);
  };

  const handleOpenUpdateDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenFormDialog(true);
    setDisableView(false);
  };

  const handleOpenDeleteDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleCloseFormDialog = (updated: boolean | undefined) => {
    setOpenFormDialog(false);
    if (updated) {
      fetchData();
    }
  };

  const handleDelete = async () => {
    if (!currentID) return;
    handleCloseDeleteDialog();
    // @ts-ignore
    const { error } = await dispatch(deleteUsage(currentID));
    if (error) {
      setNotification({ error: 'Lỗi khi xóa dạng dùng!' });
      return;
    }
    setNotification({
      message: 'Xóa thành công!',
      severity: 'success',
    });

    setUsageList(usageList.filter((x) => x.id !== currentID));
  };

  const renderAction = (row: IUsage) => {
    return (
      <>
        <IconButton onClick={handleOpenViewDialog(row.id)}>
          <VisibilityIcon />
        </IconButton>

        <IconButton onClick={handleOpenUpdateDialog(row.id)}>
          <EditIcon />
        </IconButton>

        <IconButton onClick={handleOpenDeleteDialog(row.id)}>
          <DeleteIcon />
        </IconButton>
      </>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Danh sách dạng dùng"
        placeHolder="Tìm kiếm dạng dùng"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          sx={{ fontSize: '1rem' }}
        >
          Thêm mới dạng dùng
        </Button>
      </TableSearchField>

      <TableContent total={usageList.length} loading={loading}>
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
                {usageList.map((item, index) => {
                  const { id, name } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell sx={{ width: '44%' }}>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell sx={{ width: '44%' }}>{name}</TableCell>
                      <TableCell sx={{ width: '12%' }}>
                        {renderAction(item)}
                      </TableCell>
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

      <DeleteDialog
        id={currentID}
        tableName="dạng dùng"
        name={usageList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        handleDelete={handleDelete}
      />

      <FormDialog
        currentID={currentID}
        data={usageList.find((x) => x.id === currentID)}
        open={openFormDialog}
        handleClose={handleCloseFormDialog}
        disable={disableView}
      />
    </TableWrapper>
  );
};

export default TableData;
