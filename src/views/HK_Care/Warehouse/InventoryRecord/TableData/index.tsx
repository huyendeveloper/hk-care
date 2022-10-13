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
import { LinkButton, LinkIconButton, LoadingScreen } from 'components/common';
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
import { baseURL, connectURL } from 'config';
import '../index.css';
import SelectTime, { ISelectTime } from 'components/Form/SelectTime';
import moment from 'moment';
import TableBodyContent from 'components/Table/TableBodyContent';

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

const TableData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [inventoryRecord, setInventoryRecord] = useState<InventoryItemDto[]>(
    []
  );
  const setNotification = useNotification();
  const [currentID, setCurrentID] = useState<number | string | null>(null);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const [disableView, setDisableView] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [urlDowload, seturlDowload] = useState<string>();
  const [contentDowload, setcontentDowload] = useState<string>();
  const [idDowLoad, setidDowLoad] = useState<string>();

  const cells = useMemo(() => getCells(), []);

  const fetchData = () => {
    whInventoryService
      .searchInventoryWH(filters)
      .then(({ data }) => {
        if (data.statusCode === 400) {
          setNotification({ error: data.data });
          setInventoryRecord([]);
        } else {
          setInventoryRecord(data.items);
          setTotalRows(data.totalCount);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });

    //setInventoryRecord(payload.inventoryRecord);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const _onclickDowload = (id: string) => () => {
    if (id) {
      setcontentDowload(' Đang xử lý. Vui lòng chờ!');
      handleOpen();
      setidDowLoad(id);

      return whInventoryService
        .dowLoadFile(id)
        .then((re: any) => {
          setcontentDowload('Kiểm tra dữ liệu và tải xuống!');
          setTimeout(() => {
            const url = `${connectURL}/` + re.data.data;
            //download_file(url);
            var save = document.createElement('a');
            save.href = url;
            save.target = '_blank';
            var filename = url.substring(url.lastIndexOf('/') + 1);
            save.download = filename;
            if (
              navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) &&
              navigator.userAgent.search('Chrome') < 0
            ) {
              document.location = save.href;
              // window event not working here
            } else {
              var evt = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: false,
              });
              save.dispatchEvent(evt);
              (window.URL || window.webkitURL).revokeObjectURL(save.href);
            }
            handleClose();
          }, 5000);
        })
        .catch((err) => {
          setNotification({ error: 'xử lý file lỗi!' });
          handleClose();
        });
    } else {
      setNotification({ error: 'Bản ghi không xác định.' });
    }
  };

  const handleSelectTime = (time: ISelectTime) => {
    const errorDate = moment(time.lastDate).isBefore(moment(time.startDate));
    if (errorDate) {
      setNotification({
        error:
          'Ngày kết thúc phải sau hoặc từ ngày bắt đầu. Vui lòng nhập lại!',
      });
      return;
    }
    setFilters((prev) => ({ ...prev, ...time, pageIndex: 1 }));
  };

  const renderAction = (row: InventoryItemDto) => {
    return (
      <div style={{ display: 'flex' }}>
        <div onClick={handleOpenViewDialog(row.codeInventory)}>
          <LinkIconButton to={`view/${row.codeInventory}/0`}>
            <IconButton>
              <VisibilityIcon />
            </IconButton>
          </LinkIconButton>
        </div>
        <div onClick={handleOpenUpdateDialog(row.codeInventory)}>
          <LinkIconButton to={`update/${row.codeInventory}/1`}>
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
        <iframe id="my_iframe" style={{ display: 'none' }}></iframe>
      </div>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <div>
        {' '}
        <TableSearchField
          title="Danh sách bản kiểm kê kho"
          placeHolder="Tìm kiếm bản kiểm kho"
          onSearch={handleSearch}
          searchText={filters.searchText}
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
        <SelectTime
          defaultTime={{
            startDate: filters.startDate,
            lastDate: filters.lastDate,
          }}
          onSelectTime={handleSelectTime}
        />
      </div>
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
                total={inventoryRecord.length}
                loading={loading}
                colSpan={cells.length}
              >
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
        <Box className="JVIjaoBNQp">
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            <CircularProgress /> <span>{contentDowload}</span>
          </Typography>
        </Box>
      </Modal>
    </TableWrapper>
  );
};

export default TableData;
