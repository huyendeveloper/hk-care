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
  TableRow
} from '@mui/material';
import { LinkButton, LinkIconButton, Scrollbar } from 'components/common';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableSearchField,
  TableWrapper
} from 'components/Table';
import type { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IImportReceipt } from 'interface';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    id: 'importDate',
    label: 'Ngày nhập',
  },
  {
    id: 'unitPrice',
    label: 'Tiền cần trả',
  },
  {
    id: 'inDebt',
    label: 'Công nợ',
  },
  {
    id: 'unitPrice',
    label: 'Thao tác',
  },
];

const TableData = () => {
  const setNotification = useNotification();
  const dispatch = useDispatch();
  const [importReceipt, setImportReceipt] = useState<IImportReceipt[]>([]);

  const [totalRows, setTotalRows] = useState<number>(0);
  const { loading } = useSelector((state: RootState) => state.usage);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);

  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getAllUsage(filters));

    if (error) {
      setNotification({
        error: 'Lỗi khi tải danh sách dạng dùng!',
      });
      return;
    }

    // setImportReceipt(payload.importReceipt);

    setImportReceipt([
      { id: 1, importDate: new Date('9/29/2021'), unitPrice: 78, inDebt: 86 },
      { id: 2, importDate: new Date('6/16/2021'), unitPrice: 26, inDebt: 3 },
      { id: 3, importDate: new Date('11/26/2021'), unitPrice: 61, inDebt: 28 },
      { id: 4, importDate: new Date('3/9/2022'), unitPrice: 63, inDebt: 32 },
      { id: 5, importDate: new Date('12/9/2021'), unitPrice: 80, inDebt: 60 },
      { id: 6, importDate: new Date('11/1/2021'), unitPrice: 98, inDebt: 80 },
      { id: 7, importDate: new Date('12/6/2021'), unitPrice: 66, inDebt: 26 },
      { id: 8, importDate: new Date('8/4/2021'), unitPrice: 81, inDebt: 1 },
      { id: 9, importDate: new Date('2/12/2022'), unitPrice: 99, inDebt: 3 },
      { id: 10, importDate: new Date('6/13/2021'), unitPrice: 17, inDebt: 96 },
    ]);
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

      <TableContent total={importReceipt.length} loading={loading}>
        <TableContainer sx={{ p: 1.5 }}>
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
                  const { id, importDate, unitPrice, inDebt } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{id}</TableCell>
                      <TableCell>
                        {moment(importDate).format('DD/MM/YYYY HH:MM')}
                      </TableCell>
                      <TableCell>{numberFormat(unitPrice)}</TableCell>
                      <TableCell>{numberFormat(inDebt)}</TableCell>
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
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </TableContent>
    </TableWrapper>
  );
};

export default TableData;
