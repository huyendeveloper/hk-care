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
import { IMeasure } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMeasure } from 'redux/slices/measure';
import { RootState } from 'redux/store';
import measureService from 'services/measure.service';
import { ClickEventCurrying } from 'types';
import type { FilterParams } from 'types/common';
import FormDialog from '../FormDialog';

const getCells = (): Cells<IMeasure> => [
  {
    id: 'id',
    label: 'STT',
  },
  {
    id: 'name',
    label: 'Tên đơn vị đo lường',
  },
  {
    id: 'description',
    label: 'Thao tác',
  },
];

const TableData = () => {
  const setNotification = useNotification();
  const [currentID, setCurrentID] = useState<number | null>(null);
  const [measureList, setMeasureList] = useState<IMeasure[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState<number>(0);
  const { loading } = useSelector((state: RootState) => state.measure);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const dispatch = useDispatch();

  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getAllMeasure(filters));

    if (error) {
      setNotification({
        error: 'Tên đăng nhập hoặc mật khẩu sai!',
      });
      return;
    }

    setMeasureList(payload.measureList);
    setTotalRows(Math.ceil(payload.totalCount / filters.pageSize));
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
    try {
      await measureService.delete(currentID);
      handleCloseDeleteDialog();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const renderAction = (row: IMeasure) => {
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

        <IconButton onClick={handleOpenDeleteDialog(row.id)}>
          <DeleteIcon />
        </IconButton>
      </>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Danh sách đơn vị đo lường"
        placeHolder="Tìm kiếm đơn vị đo lường"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Thêm mới đơn vị đo lường
        </Button>
      </TableSearchField>

      <TableContent total={measureList.length} loading={loading}>
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
                {measureList.map((item) => {
                  const { id, name } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>{id}</TableCell>
                      <TableCell>{name}</TableCell>
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

      <DeleteDialog
        id={currentID}
        tableName="đơn vị đo lường"
        name={measureList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        handleDelete={handleDelete}
      />

      <FormDialog
        currentID={currentID}
        data={measureList.find((x) => x.id === currentID)}
        open={openFormDialog}
        handleClose={handleCloseFormDialog}
      />
    </TableWrapper>
  );
};

export default TableData;
