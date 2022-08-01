import AddIcon from '@mui/icons-material/Add';
import { Paper, Table, TableBody, TableContainer } from '@mui/material';
import { LinkButton, Scrollbar } from 'components/common';
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
import { IExportWHRotation } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllExportWHRotation } from 'redux/slices/exportWHRotation';
import type { FilterParams } from 'types/common';
import ExpandRow from './ExpandRow';

const getCells = (): Cells<IExportWHRotation> => [
  {
    id: 'id',
    label: 'STT',
  },
  {
    id: 'id',
    label: 'Mã hóa đơn',
  },
  {
    id: 'id',
    label: 'Ngày xuất',
  },
  {
    id: 'id',
    label: 'Tổng giá trị xuất',
  },
  {
    id: 'id',
    label: 'Thao tác',
  },
];

const TableData = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [circulationInvoice, setCirculationInvoice] = useState<object>([]);

  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    let rowId = 1 + (filters.pageIndex - 1) * filters.pageSize;
    // @ts-ignore
    const { payload, error } = await dispatch(getAllExportWHRotation(filters));
    if (error) {
      setNotification({ error: 'Lỗi!' });
      setLoading(false);
      return;
    }
    const exportWHRotationList = [
      ...(payload.exportWHRotation as IExportWHRotation[]),
    ].reduce((group, product) => {
      // @ts-ignore
      const { rotationName } = product;
      // @ts-ignore
      group[rotationName] = group[rotationName] ?? [];
      // @ts-ignore
      group[rotationName].push({ ...product, rowId });
      rowId = rowId + 1;
      return group;
    }, {});

    setCirculationInvoice(exportWHRotationList);
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

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Danh sách hóa đơn xuất luân chuyển"
        placeHolder="Tìm kiếm hóa đơn"
        onSearch={handleSearch}
        searchText={filters.searchText}
        start={filters.startDate}
        end={filters.lastDate}
        setStart={(val) => setFilters({ ...filters, startDate: val })}
        setEnd={(val) => setFilters({ ...filters, lastDate: val })}
        haveFromTo
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

      <TableContent
        total={Object.keys(circulationInvoice).length}
        loading={loading}
      >
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
                {Object.keys(circulationInvoice).map((key) => {
                  return (
                    <ExpandRow
                      key={key}
                      groupName={key} // @ts-ignore
                      list={circulationInvoice[key]}
                      filters={filters}
                    />
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
