import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { LinkButton, LinkIconButton } from 'components/common';
import Scrollbar from 'components/common/Scrollbar';
import TableContent from 'components/Table/TableContent';
import TableHeader, { Cells } from 'components/Table/TableHeader';
import TablePagination from 'components/Table/TablePagination';
import TableSearchField from 'components/Table/TableSearchField';
import TableWrapper from 'components/Table/TableWrapper';
import { defaultFilters } from 'constants/defaultFilters';
import useNotification from 'hooks/useNotification';
import { IInventoryRecord, InventoryItemDto } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ClickEventCurrying, FilterParams } from 'types';
import formatDateTime from 'utils/dateTimeFormat';
import { numberFormat } from 'utils/numberFormat';
import whInventoryService from 'services/whInventory.service';

const getCells = (): Cells<IInventoryRecord> => [
  {
    id: 'id',
    label: 'STT',
  },
  {
    id: 'code',
    label: 'Mã biên bản kiểm kê',
  },
  {
    id: 'date',
    label: 'Ngày kiểm kê',
  },
  {
    id: 'staff',
    label: 'Nhân viên kiểm',
  },
  {
    id: 'totalRevenueDiff',
    label: 'Tổng lệch doanh thu',
  },
  {
    id: 'date',
    label: 'Thao tác',
  },
];
const styleModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const TableData = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [loading, setLoading] = useState<boolean>(true);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [inventoryRecord, setInventoryRecord] = useState<InventoryItemDto[]>(
    []
  );

  const [currentID, setCurrentID] = useState<number | string | null>(null);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const [disableView, setDisableView] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const cells = useMemo(() => getCells(), []);

  const fetchData = () => {
    whInventoryService
      .searchInventoryWH(filters)
      .then(({ data }) => {
        setInventoryRecord(data.data);
        setTotalRows(data.totalCount);
      })
      .catch((err) => {})
      .finally(() => {});

    //setInventoryRecord(payload.inventoryRecord);
    setLoading(false);
  };

  const fetchDowloadFile = (id: string) => {
    whInventoryService
      .dowLoadFile(id)
      .then((data) => {})
      .catch((err) => {})
      .finally(() => {});
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

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const _onclickDowload = (id: string) => () => {
    handleOpen();
    fetchDowloadFile(id);
  };

  const renderAction = (row: InventoryItemDto) => {
    return (
      <div style={{ display: 'flex' }}>
        <div onClick={handleOpenViewDialog(row.codeInventory)}>
          <LinkIconButton to={`create/${row.codeInventory}/0`}>
            <IconButton>
              <VisibilityIcon />
            </IconButton>
          </LinkIconButton>
        </div>
        <div onClick={handleOpenUpdateDialog(row.codeInventory)}>
          <LinkIconButton to={`create/${row.codeInventory}/1`}>
            <IconButton>
              <EditIcon />
            </IconButton>
          </LinkIconButton>
        </div>
        <div onClick={_onclickDowload(row.codeInventory)}>
          <IconButton>
            <DownloadIcon />
          </IconButton>
        </div>
      </div>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Danh sách bản kiểm kê kho"
        placeHolder="Tìm kiếm bản kiểm kho"
        onSearch={handleSearch}
        searchText={filters.searchText}
        start={filters.startDate}
        end={filters.lastDate}
        setStart={(val) =>
          setFilters({ ...filters, pageIndex: 1, startDate: val })
        }
        setEnd={(val) =>
          setFilters({ ...filters, pageIndex: 1, lastDate: val })
        }
        haveFromTo
      >
        <LinkButton
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{ fontSize: '1rem' }}
          to="create"
        >
          Thêm bản kiểm kho
        </LinkButton>
      </TableSearchField>

      <TableContent total={inventoryRecord.length} loading={loading}>
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
                {inventoryRecord.map((item, index) => {
                  const {
                    codeInventory,
                    createByName,
                    createByOnUtc,
                    totalRevenue,
                  } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={codeInventory}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{codeInventory}</TableCell>
                      <TableCell>{formatDateTime(createByOnUtc)}</TableCell>
                      <TableCell>{createByName}</TableCell>
                      <TableCell>{numberFormat(totalRevenue)}</TableCell>
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

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBackdrop}
        onClick={() => setShowBackdrop(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={styleModal}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Đang tải xuống. Vui lòng chờ!
          </Typography>
        </Box>
      </Modal>
    </TableWrapper>
  );
};

export default TableData;
