import { DatePicker } from '@mui/lab';
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Scrollbar } from 'components/common';
import ChooseOption from 'components/Form/ChooseOption';
import { TableContent, TableHeader, TableWrapper } from 'components/Table';
import type { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IImportReceipt, IStaff } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllImportReceipt } from 'redux/slices/importReceipt';
import type { FilterParams } from 'types/common';
import formatDateTime from 'utils/dateTimeFormat';
import { numberFormat } from 'utils/numberFormat';
import DefaultFilter from '../components/DefaultFilter';
import FilterByStaff from '../components/FilterByStaff';

const getCells = (): Cells<IImportReceipt> => [
  {
    id: 'id',
    label: 'STT',
  },
  {
    id: 'id',
    label: 'Mã hóa đơn',
  },
  {
    id: 'creationTime',
    label: 'Ngày bán',
  },
  {
    id: 'moneyToPay',
    label: 'Giá trị hóa đơn',
  },
  {
    id: 'debts',
    label: 'Doanh thu',
  },
];

const TableData = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();

  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [importReceipt, setImportReceipt] = useState<IImportReceipt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [staffChoosed, setStaffChoosed] = useState<number | null>(null);
  const [staffList, setStaffList] = useState<IStaff[]>([]);

  useEffect(() => {
    setStaffList([{ id: 1, name: 'Nguyễn Thu Trang' }]);
  }, []);

  useEffect(() => {
    console.log('staffChoosed', staffChoosed);
  }, [staffChoosed]);

  const cells = useMemo(() => getCells(), []);

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

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <Box p={1.5}>
        <Typography
          color="text.secondary"
          sx={{ fontWeight: 'regular', fontSize: '1.74rem' }}
        >
          Báo cáo doanh thu
        </Typography>
        <Grid container py={2}>
          <Grid item xs={6}>
            <ChooseOption
              options={staffList}
              renderLabel={(field) => field.name}
              noOptionsText="Không tìm thấy nhân viên"
              renderValue="id"
              placeholder="Tất cả nhân viên"
              onChangeSelect={onChangeSelect}
              value={staffChoosed}
            />
          </Grid>
          <Grid item xs={3} pl={2}>
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
        </Grid>
      </Box>

      <TableContent total={importReceipt.length} loading={loading}>
        <TableContainer sx={{ p: 1.5, maxHeight: '60vh' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 'max-content' }} size="small">
              {/* <TableHeader
                cells={cells}
                onSort={handleOnSort}
                sortDirection={filters.sortDirection}
                sortBy={filters.sortBy}
              />

              <TableBody>
                {importReceipt.map((item, index) => {
                  const { id, code, creationTime, moneyToPay, debts } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{code}</TableCell>
                      <TableCell>{formatDateTime(creationTime)}</TableCell>
                      <TableCell>{numberFormat(moneyToPay)}</TableCell>
                      <TableCell>{numberFormat(debts)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody> */}
              {staffChoosed ? <FilterByStaff /> : <DefaultFilter />}
            </Table>
          </Scrollbar>
        </TableContainer>
      </TableContent>
    </TableWrapper>
  );
};

export default TableData;
