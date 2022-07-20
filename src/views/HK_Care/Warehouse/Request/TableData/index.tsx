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
import { LinkButton, LinkIconButton, Scrollbar } from 'components/common';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableSearchField,
  TableWrapper,
} from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { IRequestImport } from 'interface';
import { useEffect, useMemo, useState } from 'react';
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
    id: 'requestDate',
    label: 'Ngày yêu cầu',
  },
  {
    id: 'requestDate',
    label: 'Thao tác',
  },
];

const TableData = () => {
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [requestImport, setRequestImport] = useState<IRequestImport[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);

  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    const payload = {
      requestImport: [
        { id: 1, code: 'Ahmed', requestDate: new Date('2022/12/15') },
        { id: 2, code: 'Erika', requestDate: new Date('2022/12/15') },
        { id: 3, code: 'Casie', requestDate: new Date('2022/12/15') },
        { id: 4, code: 'Derril', requestDate: new Date('2022/12/15') },
        { id: 5, code: 'Jobyna', requestDate: new Date('2022/12/15') },
        { id: 6, code: 'Corbett', requestDate: new Date('2022/12/15') },
        { id: 7, code: 'Ivor', requestDate: new Date('2022/12/15') },
        { id: 8, code: 'Robbi', requestDate: new Date('2022/12/15') },
        { id: 9, code: 'Elinor', requestDate: new Date('2022/12/15') },
        { id: 10, code: 'Mathian', requestDate: new Date('2022/12/15') },
      ],
      totalCount: 35,
    };

    setRequestImport(payload.requestImport);
    setTotalRows(payload.totalCount);
  };

  useEffect(() => {
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
      <TableSearchField
        title="Danh sách yêu cầu nhập"
        placeHolder="Tìm kiếm phiếu yêu cầu"
        onSearch={handleSearch}
        searchText={filters.searchText}
        start={filters.startDate}
        end={filters.lastDate}
        setStart={(val) =>
          setFilters({ ...filters, pageIndex: 1, startDate: val })
        }
        setEnd={(val) =>
          setFilters({ ...filters, pageIndex: 1, lastDate: val })
        }
        haveFromTo
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

      <TableContent total={requestImport.length} loading={false}>
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
                {requestImport.map((item, index) => {
                  const { id, code, requestDate } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{code}</TableCell>
                      <TableCell>{formatDateTime(requestDate)}</TableCell>
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
