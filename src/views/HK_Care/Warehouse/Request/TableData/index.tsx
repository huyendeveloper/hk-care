import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  IconButton,
  Paper,
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
  TableHeader,
  TablePagination,
  TableSearchField,
  TableWrapper,
} from 'components/Table';
import TableBodyContent from 'components/Table/TableBodyContent';
import { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IRequestImport } from 'interface';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllExpected } from 'redux/slices/expected';
import { FilterParams } from 'types';
import formatDateTime from 'utils/dateTimeFormat';

const getCells = (): Cells<IRequestImport> => [
  {
    id: 'id',
    label: 'STT',
  },
  {
    id: 'code',
    label: 'Mã phiếu yêu cầu',
  },
  {
    id: 'expectedDate',
    label: 'Ngày yêu cầu',
  },
  {
    id: 'expectedDate',
    label: 'Thao tác',
  },
];

const TableData = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();

  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [requestImport, setRequestImport] = useState<IRequestImport[]>([]);

  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getAllExpected(filters));

    if (error) {
      setNotification({
        error: 'Hệ thống đang gặp sự cố',
      });
      setLoading(false);
      return;
    }
    setRequestImport(payload.expectedList);
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

  const renderAction = (row: IRequestImport) => {
    return (
      <LinkIconButton to={`${row.id}`}>
        <IconButton>
          <VisibilityIcon />
        </IconButton>
      </LinkIconButton>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <div>
        <TableSearchField
          title="Danh sách yêu cầu nhập"
          placeHolder="Tìm kiếm phiếu yêu cầu"
          onSearch={handleSearch}
          searchText={filters.searchText}
        >
          <LinkButton
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ fontSize: '1rem' }}
            to="create"
          >
            Tạo mới yêu cầu nhập
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
                total={requestImport.length}
                loading={loading}
                colSpan={cells.length}
              >
                {requestImport.map((item, index) => {
                  const { id, code, expectedDate } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{code}</TableCell>
                      <TableCell>{formatDateTime(expectedDate)}</TableCell>
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
