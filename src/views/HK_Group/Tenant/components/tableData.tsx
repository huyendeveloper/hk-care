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
import { Scrollbar } from 'components/common';
import { BlockDialog, UnBlockDialog } from 'components/Dialog';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableSearchField,
  TableWrapper,
} from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeStatus } from 'redux/slices/tenant';
import salePointService from 'services/salePoint.service';
import { FilterParams } from 'types';
import { SalePointOutDto } from '../dto/salePointDto';
import { TableActive } from '../enum/IsStatus';
import FormDialog from './formDialog';

const getCells = (): Cells<SalePointOutDto> => [
  { id: 'id', label: 'STT' },
  { id: 'name', label: 'Tên điểm bán' },
  { id: 'address', label: 'Địa chỉ' },
  { id: 'hotline', label: 'Hotline' },
  { id: 'isActived', label: 'Trạng thái' },
  { id: 'id', label: 'Thao tác' },
];

const TableData = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [disableView, setDisableView] = useState<boolean>(false);
  const [currentID, setCurrentID] = useState<string | null>(null);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [tenantList, setTenantList] = useState<SalePointOutDto[]>([]);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [openBlockDialog, setOpenBlockDialog] = useState<boolean>(false);
  const [openUnBlockDialog, setOpenUnBlockDialog] = useState<boolean>(false);

  const cells = useMemo(() => getCells(), []);

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

  const handleOpenUpdateDialog = (id: string) => () => {
    setCurrentID(id);
    setOpenFormDialog(true);
    setDisableView(false);
  };

  const handleOpenViewDialog = (id: string) => () => {
    setCurrentID(id);
    setDisableView(true);
    setOpenFormDialog(true);
  };

  const handleOpenCreateDialog = () => {
    setCurrentID(null);
    setDisableView(false);
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
  };

  const handleOpenUnBlockDialog = (id: string) => () => {
    setCurrentID(id);
    setOpenUnBlockDialog(true);
  };

  const handleOpenBlockDialog = (id: string) => () => {
    setCurrentID(id);
    setOpenBlockDialog(true);
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
      changeStatus({ id: currentID })
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
      changeStatus({ id: currentID })
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

  const fetchData = async () => {
    const data = async () => await salePointService.search(filters);
    data()
      .then((rel) => {
        setTenantList(rel.items);
        setTotalRows(rel.totalCount);
        setLoading(false);
      })
      .catch((error) => {
        setTenantList([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const renderAction = (row: SalePointOutDto) => {
    return (
      <>
        <IconButton onClick={handleOpenViewDialog(row.id)}>
          <VisibilityIcon />
        </IconButton>
        <IconButton onClick={handleOpenUpdateDialog(row.id)}>
          <EditIcon />
        </IconButton>

        {row.isActived ? (
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
        title="Danh sách điểm bán"
        placeHolder="Tìm kiếm điểm bán"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          sx={{ fontSize: '1rem' }}
        >
          Thêm điểm bán mới
        </Button>
      </TableSearchField>

      <TableContent total={tenantList.length} loading={loading}>
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
                {tenantList.map((item: any, index: number) => {
                  const { id, name, address, hotline, isActived } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{name}</TableCell>

                      <TableCell>{address}</TableCell>
                      <TableCell>{hotline}</TableCell>
                      <TableCell>
                        {isActived === TableActive.Active ? (
                          <Button>Hoạt động</Button>
                        ) : (
                          <Button color="error">Dừng Hoạt động</Button>
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

      <FormDialog
        currentID={currentID}
        open={openFormDialog}
        handleClose={handleCloseFormDialog}
        disable={disableView}
        fetchTable={fetchData}
      />

      <BlockDialog
        id={currentID}
        tableName="điểm bán"
        name={tenantList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseBlockDialog}
        open={openBlockDialog}
        handleBlock={handleBlock}
      />

      <UnBlockDialog
        id={currentID}
        tableName="điểm bán"
        name={tenantList.find((x) => x.id === currentID)?.name}
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
