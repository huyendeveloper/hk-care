import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import {
  LinkButton,
  LinkIconButton,
  LoadingScreen,
  Scrollbar,
} from 'components/common';
import SelectTime, { ISelectTime } from 'components/Form/SelectTime';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableSearchField,
  TableWrapper,
} from 'components/Table';
import TableBodyContent from 'components/Table/TableBodyContent';
import type { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IImportReceipt } from 'interface';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllImportReceipt } from 'redux/slices/importReceipt';
import type { FilterParams } from 'types/common';
import formatDateTime from 'utils/dateTimeFormat';
import { numberFormat } from 'utils/numberFormat';

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
    label: 'Ngày nhập',
  },
  {
    id: 'moneyToPay',
    label: 'Tiền cần trả',
  },
  {
    id: 'debts',
    label: 'Công nợ',
  },
  {
    id: 'moneyToPay',
    label: 'Thao tác',
  },
];

const TableData = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();

  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [importReceipt, setImportReceipt] = useState<IImportReceipt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getAllImportReceipt(filters));
    if (error) {
      setNotification({
        error: 'Hệ thống đang gặp sự cố',
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

  const handleSearch = (searchText: string) => {
    setFilters((state) => ({
      ...state,
      searchText,
    }));
  };

  const renderAction = (row: IImportReceipt) => {
    return (
      <>
        <LinkIconButton to={`${row.id}`}>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </LinkIconButton>
        <LinkIconButton to={`${row.id}/update`}>
          <IconButton>
            <EditIcon />
          </IconButton>
        </LinkIconButton>
      </>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <div>
        <TableSearchField
          title="Danh sách hóa đơn nhập kho"
          placeHolder="Tìm kiếm hóa đơn"
          onSearch={handleSearch}
          searchText={filters.searchText}
        >
          <LinkButton
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ fontSize: '1rem' }}
            to="create"
          >
            Thêm hóa đơn
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
                total={importReceipt.length}
                loading={loading}
                colSpan={cells.length}
              >
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
                      <TableCell>{renderAction(item)}</TableCell>
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
    </TableWrapper>
  );
};

export default TableData;
