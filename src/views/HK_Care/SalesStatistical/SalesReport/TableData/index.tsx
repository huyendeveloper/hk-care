import { DatePicker, LoadingButton } from '@mui/lab';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Table,
  TableContainer,
  TextField,
  Typography,
} from '@mui/material';
import { Scrollbar } from 'components/common';
import { Selecter } from 'components/Form';
import ChooseOption from 'components/Form/ChooseOption';
import { TableContent, TableWrapper } from 'components/Table';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IImportReceipt, IStaff } from 'interface';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllImportReceipt } from 'redux/slices/importReceipt';
import type { FilterParams } from 'types/common';
import DefaultFilter from '../components/DefaultFilter';
import FilterByStaff from '../components/FilterByStaff';
import DownloadIcon from '@mui/icons-material/Download';

const TableData = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();

  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [importReceipt, setImportReceipt] = useState<IImportReceipt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [staffChoosed, setStaffChoosed] = useState<number | null>(null);
  const [staffList, setStaffList] = useState<IStaff[]>([]);

  useEffect(() => {
    setStaffList([{ id: 1, name: 'Nguyễn Thu Trang' }]);
  }, []);

  const onChangeSelect = (value: number | null) => {
    setStaffChoosed(value);
  };

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getAllImportReceipt(filters));
    if (error) {
      setNotification({
        error: 'Lỗi!',
      });
      setLoading(false);
      return;
    }

    setImportReceipt(payload.importReceiptList);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <Box p={1.5}>
        <Typography
          color="text.secondary"
          sx={{ fontWeight: 'regular', fontSize: '1.74rem' }}
        >
          Báo cáo doanh thu
        </Typography>
        <Stack flexDirection="row" py={2} gap={1}>
          <Grid item width="800px">
            <Selecter
              options={staffList}
              renderLabel={(field) => field.name}
              noOptionsText="Không tìm thấy sản phẩm"
              renderValue="id"
              placeholder="Tất cả nhân viên"
              defaultValue=""
              onChangeSelect={(value: number | null) => setStaffChoosed(value)}
            />
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
        </Stack>
      </Box>

      <Stack flexDirection="row" justifyContent="flex-end" px={2} gap={2}>
        <LoadingButton
          loadingPosition="start"
          startIcon={<DownloadIcon />}
          sx={{ height: '40px', width: '100px' }}
          variant="outlined"
        >
          PDF
        </LoadingButton>
        <LoadingButton sx={{ height: '40px', width: '100px' }}>
          Báo cáo
        </LoadingButton>
      </Stack>

      <TableContent total={importReceipt.length} loading={loading}>
        <TableContainer sx={{ p: 1.5, maxHeight: '60vh' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 'max-content' }} size="small">
              {staffChoosed ? <FilterByStaff /> : <DefaultFilter />}
            </Table>
          </Scrollbar>
        </TableContainer>
      </TableContent>
    </TableWrapper>
  );
};

export default TableData;
