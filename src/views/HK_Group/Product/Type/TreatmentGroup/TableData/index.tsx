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
import Scrollbar from 'components/common/Scrollbar';
import DeleteDialog from 'components/Dialog/DeleteDialog';
import TableContent from 'components/Table/TableContent';
import TableHeader, { Cells } from 'components/Table/TableHeader';
import TablePagination from 'components/Table/TablePagination';
import TableSearchField from 'components/Table/TableSearchField';
import TableWrapper from 'components/Table/TableWrapper';
import { defaultFilters } from 'constants/defaultFilters';
import useNotification from 'hooks/useNotification';
import { ITreatmentGroup } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  deleteTreatmentGroup,
  getAllTreatmentGroup,
} from 'redux/slices/treatmentGroup';
import { ClickEventCurrying, FilterParams } from 'types';
import FormDialog from '../FormDialog';

const getCells = (): Cells<ITreatmentGroup> => [
  {
    id: 'id',
    label: 'STT',
  },
  {
    id: 'name',
    label: 'Tên nhóm điều trị',
  },
  {
    id: 'description',
    label: 'Thao tác',
  },
];

const TableData = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [loading, setLoading] = useState<boolean>(true);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [treatmentGroupList, setTreatmentGroupList] = useState<
    ITreatmentGroup[]
  >([]);
  const [currentID, setCurrentID] = useState<number | null>(null);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const [disableView, setDisableView] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getAllTreatmentGroup(filters));

    if (error) {
      setNotification({ error: 'Lỗi!' });
      setLoading(false);
      return;
    }

    setTreatmentGroupList(payload.treatmentGroupList);
    setTotalRows(payload.totalCount);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleOpenCreateDialog = () => {
    setCurrentID(null);
    setOpenFormDialog(true);
    setDisableView(false);
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

  const handleOpenDeleteDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
  };

  const handleDelete = async () => {
    setShowBackdrop(true);
    if (!currentID) return;
    handleCloseDeleteDialog();
    // @ts-ignore
    const { error, payload } = await dispatch(deleteTreatmentGroup(currentID));
    if (error) {
      setNotification({ error: payload.response.data || 'Lỗi!' });
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

  const handleOpenUpdateDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenFormDialog(true);
    setDisableView(false);
  };

  const handleOpenViewDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setDisableView(true);
    setOpenFormDialog(true);
  };

  const renderAction = (row: ITreatmentGroup) => {
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
        title="Danh sách nhóm điều trị"
        placeHolder="Tìm kiếm nhóm điều trị"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          sx={{ fontSize: '1rem' }}
        >
          Thêm mới nhóm điều trị
        </Button>
      </TableSearchField>

      <TableContent total={treatmentGroupList.length} loading={loading}>
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
                {treatmentGroupList.map((item, index) => {
                  const { id, name } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell sx={{ width: '44%' }}>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell sx={{ width: '44%' }}>{name}</TableCell>
                      <TableCell sx={{ width: '12%' }} align="left">
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
        tableName="nhóm điều trị"
        name={treatmentGroupList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        handleDelete={handleDelete}
        loading={showBackdrop}
      />

      <FormDialog
        currentID={currentID}
        data={treatmentGroupList.find((x) => x.id === currentID)}
        open={openFormDialog}
        handleClose={handleCloseFormDialog}
        disable={disableView}
        fetchData={fetchData}
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
