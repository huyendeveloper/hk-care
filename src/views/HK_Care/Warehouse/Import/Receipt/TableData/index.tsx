import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
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
import { LinkButton, LinkIconButton, Scrollbar } from 'components/common';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableSearchField,
  TableWrapper,
} from 'components/Table';
import type { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { previousDay } from 'date-fns';
import { useNotification } from 'hooks';
import { IImportReceipt } from 'interface';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllImportReceipt } from 'redux/slices/importReceipt';
import { getAllUsage } from 'redux/slices/usage';
import { RootState } from 'redux/store';
import type { FilterParams } from 'types/common';
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
  const setNotification = useNotification();
  const dispatch = useDispatch();
  const [importReceipt, setImportReceipt] = useState<IImportReceipt[]>([]);

  const [totalRows, setTotalRows] = useState<number>(0);
  // const { loading } = useSelector((state: RootState) => state.usage);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);

  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getAllImportReceipt(filters));
    if (error) {
      setNotification({
        error: 'Lỗi!',
      });
      return;
    }

    // setImportReceipt([
    //   { id: 1, creationTime: new Date('9/29/2021'), moneyToPay: 78, debts: 86 },
    //   { id: 2, creationTime: new Date('6/16/2021'), moneyToPay: 26, debts: 3 },
    //   { id: 3, creationTime: new Date('11/26/2021'), moneyToPay: 61, debts: 28 },
    //   { id: 4, creationTime: new Date('3/9/2022'), moneyToPay: 63, debts: 32 },
    //   { id: 5, creationTime: new Date('12/9/2021'), moneyToPay: 80, debts: 60 },
    //   { id: 6, creationTime: new Date('11/1/2021'), moneyToPay: 98, debts: 80 },
    //   { id: 7, creationTime: new Date('12/6/2021'), moneyToPay: 66, debts: 26 },
    //   { id: 8, creationTime: new Date('8/4/2021'), moneyToPay: 81, debts: 1 },
    //   { id: 9, creationTime: new Date('2/12/2022'), moneyToPay: 99, debts: 3 },
    //   { id: 10, creationTime: new Date('6/13/2021'), moneyToPay: 17, debts: 96 },
    // ]);
    setImportReceipt(payload.importReceiptList);
    setTotalRows(payload.totalCount);
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
      <TableSearchField
        title="Danh sách hóa đơn nhập kho"
        placeHolder="Tìm kiếm hóa đơn"
        onSearch={handleSearch}
        searchText={filters.searchText}
        start={filters.startDate}
        end={filters.lastDate}
        setStart={(val) => setFilters({ ...filters, startDate: val })}
        setEnd={(val) => setFilters({ ...filters, lastDate: val })}
        searchArea
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

      <TableContent total={importReceipt.length} loading={false}>
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
                {importReceipt.map((item, index) => {
                  const { id, code, creationTime, moneyToPay, debts } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{code}</TableCell>
                      <TableCell>
                        {moment(creationTime).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                      <TableCell>{numberFormat(moneyToPay)}</TableCell>
                      <TableCell>{numberFormat(debts)}</TableCell>
                      <TableCell>{renderAction(item)}</TableCell>
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
    </TableWrapper>
  );
};

export default TableData;
