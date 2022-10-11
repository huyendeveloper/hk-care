import DownloadIcon from '@mui/icons-material/Download';
import { DatePicker, LoadingButton } from '@mui/lab';
import {
  Box,
  Divider,
  Grid,
  Paper,
  Stack,
  Table,
  TableContainer,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Scrollbar } from 'components/common';
import { Selecter } from 'components/Form';
import { TableContent, TablePagination, TableWrapper } from 'components/Table';
import { connectURL } from 'config';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IRevenueReport, IRevenueReportStaff, IStaff } from 'interface';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  getRevenueReportAll,
  getRevenueReportByUser,
} from 'redux/slices/revenueReport';
import revenueReportService from 'services/revenueReport.service';
import type { FilterParams } from 'types/common';
import DefaultFilter from '../components/DefaultFilter';
import FilterByStaff from '../components/FilterByStaff';

const TableData = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();

  const [revenueReport, setRevenueReport] = useState<IRevenueReport[]>([]);
  const [revenueReportStaff, setRevenueReportStaff] = useState<
    IRevenueReportStaff[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [staffList, setStaffList] = useState<IStaff[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [staffChoosed, setStaffChoosed] = useState<number | null>(null);
  const [staffId, setStaffId] = useState<number | null>(null);
  const [reported, setReported] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    if (!Boolean(filters.startDate) || !Boolean(filters.lastDate)) {
      setLoading(false);
      return;
    }

    if (staffChoosed) {
      // @ts-ignore
      const { payload, error } = await dispatch(
        // @ts-ignore
        getRevenueReportByUser({ ...filters, userId: staffChoosed })
      );

      if (error) {
        setNotification({
          error: 'Lỗi!',
        });
        setLoading(false);
        return;
      }

      setRevenueReportStaff(payload.revenueReport);
      setTotalRows(payload.totalCount);
      setTotalRevenue(payload.totalRevenue);
    } else {
      // @ts-ignore
      const { payload, error } = await dispatch(getRevenueReportAll(filters));
      if (error) {
        setNotification({
          error: 'Lỗi!',
        });
        setLoading(false);
        return;
      }

      setRevenueReport(payload.revenueReport);
      setTotalRows(payload.totalCount);
      setTotalRevenue(payload.totalRevenue);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    revenueReportService
      .getSaleEmployee()
      .then(({ data }) => {
        setStaffList(data);
        // setSupplierList(data);
      })
      .catch((err) => {})
      .finally(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDownload = () => {
    if (!Boolean(filters.startDate) || !Boolean(filters.lastDate)) {
      setLoading(false);
      return;
    }
    handleOpen();

    return revenueReportService
      .dowLoadFile(filters, staffChoosed)
      .then((re: any) => {
        setTimeout(() => {
          const url = `${connectURL}/` + re.data;
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
  };

  const handleReport = () => {
    const errorDate = moment(filters.lastDate).isBefore(
      moment(filters.startDate)
    );
    if (errorDate) {
      setNotification({
        error:
          'Ngày kết thúc phải sau hoặc từ ngày bắt đầu. Vui lòng nhập lại!',
      });
      return;
    }
    setLoading(true);
    setStaffId(staffChoosed);
    setReported(true);
    fetchData();
  };

  const renderTable = () => {
    if (
      !Boolean(filters.startDate) ||
      !Boolean(filters.lastDate) ||
      !reported
    ) {
      return (
        <Wrapper>
          <Box sx={{ display: 'grid', placeContent: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Vui lòng chọn ngày bắt đầu và ngày kết thúc
            </Typography>
          </Box>
        </Wrapper>
      );
    }

    return (
      <TableContent
        total={staffId ? revenueReportStaff.length : revenueReport.length}
        loading={loading}
      >
        <TableContainer sx={{ p: 1.5, maxHeight: '60vh' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 'max-content' }} size="small">
              {staffId ? (
                <FilterByStaff
                  revenueReportStaff={revenueReportStaff}
                  filters={filters}
                  totalRevenue={totalRevenue}
                />
              ) : (
                <DefaultFilter
                  revenueReport={revenueReport}
                  filters={filters}
                  totalRevenue={totalRevenue}
                />
              )}
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
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <Box p={1.5}>
        <Typography
          color="text.secondary"
          sx={{ fontWeight: 'regular', fontSize: '1.74rem' }}
        >
          Báo cáo doanh thu
        </Typography>
        <Divider />
        <Stack flexDirection="row" justifyContent={'flex-end'} py={2} gap={1}>
          <Grid item xs={5}>
            {/* <Selecter
              options={staffList}
              renderLabel={(field) => field.name}
              noOptionsText="Không tìm thấy nhân viên"
              renderValue="userId"
              placeholder="Tất cả nhân viên"
              defaultValue=""
              onChangeSelect={(value: number | null) => setStaffChoosed(value)}
            /> */}
          </Grid>
          <Grid item xs={3}>
            <DatePicker
              // @ts-ignore
              value={filters.startDate}
              onChange={(newValue) => {
                setFilters({ ...filters, startDate: newValue || null });
              }}
              inputFormat="dd/MM/yyyy"
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    placeholder: 'Từ',
                  }}
                />
              )}
            />
          </Grid>
          <h2 style={{ margin: 0 }}>-</h2>
          <Grid item xs={3}>
            <DatePicker
              // @ts-ignore
              value={filters.lastDate}
              onChange={(newValue) => {
                setFilters({ ...filters, lastDate: newValue || null });
              }}
              inputFormat="dd/MM/yyyy"
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    placeholder: 'Đến',
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={1}>
            <LoadingButton
              sx={{ height: '40px', width: '100px' }}
              onClick={handleReport}
            >
              Báo cáo
            </LoadingButton>
          </Grid>
        </Stack>
        <Stack flexDirection="row" justifyContent="flex-end" gap={2}>
          <LoadingButton
            loadingPosition="start"
            startIcon={<DownloadIcon />}
            sx={{ height: '40px', width: '100px' }}
            variant="outlined"
            onClick={handleDownload}
            loading={open}
          >
            PDF
          </LoadingButton>
        </Stack>
      </Box>

      {renderTable()}
    </TableWrapper>
  );
};

const Wrapper = styled(Box)({
  display: 'grid',
  gridTemplateRows: '1fr auto',
});

export default TableData;
