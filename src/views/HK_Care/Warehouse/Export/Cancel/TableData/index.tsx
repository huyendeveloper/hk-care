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
import SelectTime, { ISelectTime } from 'components/Form/SelectTime';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableSearchField,
  TableWrapper,
} from 'components/Table';
import type { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IExportCancel } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllExportCancel } from 'redux/slices/exportCancel';
import type { FilterParams } from 'types/common';
import formatDateTime from 'utils/dateTimeFormat';
import { numberFormat } from 'utils/numberFormat';

const getCells = (): Cells<IExportCancel> => [
  {
    id: 'code',
    label: 'STT',
  },
  {
    id: 'code',
    label: 'Mã hóa đơn',
  },
  {
    id: 'from',
    label: 'Ngày xuất',
  },
  {
    id: 'from',
    label: 'Tổng giá trị hủy',
  },
  {
    id: 'from',
    label: 'Thao tác',
  },
];

const TableData = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();

  const [exportCancel, setExportCancel] = useState<IExportCancel[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);

  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getAllExportCancel(filters));
    if (error) {
      setNotification({ error: 'Lỗi!' });
      setLoading(false);
      return;
    }

    setExportCancel(payload.exportWHList);
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

  const handleSearch = (searchText: string) => {
    setFilters((state) => ({
      ...state,
      searchText,
    }));
  };

  const handleSelectTime = (time: ISelectTime) => {
    setFilters((prev) => ({ ...prev, ...time, pageIndex: 1 }));
  };

  const renderAction = (row: IExportCancel) => {
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
        title="Danh sách hóa đơn xuất hủy"
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

      <TableContent total={exportCancel.length} loading={loading}>
        <TableContainer sx={{ p: 1.5, maxHeight: '60vh' }}>
          <SelectTime
            defaultTime={{
              startDate: filters.startDate,
              lastDate: filters.lastDate,
            }}
            onSelectTime={handleSelectTime}
          />
          <Scrollbar>
            <Table sx={{ minWidth: 'max-content' }} size="small">
              <TableHeader
                cells={cells}
                onSort={handleOnSort}
                sortDirection={filters.sortDirection}
                sortBy={filters.sortBy}
              />

              <TableBody>
                {exportCancel.map((item, index) => {
                  const { id, code, creationTime, totalFee } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{code}</TableCell>
                      <TableCell>{formatDateTime(creationTime)}</TableCell>
                      <TableCell>{numberFormat(totalFee)}</TableCell>
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