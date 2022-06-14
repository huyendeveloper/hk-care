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
import { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { ISalesOrder } from 'interface';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { FilterParams } from 'types';
import { numberFormat } from 'utils/numberFormat';

const getCells = (): Cells<ISalesOrder> => [
  {
    id: 'id',
    label: 'STT',
  },
  {
    id: 'id',
    label: 'Số hóa đơn',
  },
  {
    id: 'salesDate',
    label: 'Ngày bán',
  },
  {
    id: 'customer',
    label: 'Khách hàng',
  },
  {
    id: 'type',
    label: 'Loại hóa đơn',
  },
  {
    id: 'saler',
    label: 'Nhân viên bán hàng',
  },
  {
    id: 'pay',
    label: 'Khách phải trả',
  },
  {
    id: 'saler',
    label: 'Thao tác',
  },
];

const TableData = () => {
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [salesOrder, setSalesOrder] = useState<ISalesOrder[]>([]);
  const { loading } = useSelector((state: RootState) => state.usage);
  const [totalRows, setTotalRows] = useState<number>(0);

  useEffect(() => {
    setSalesOrder([
      {
        id: 1,
        salesDate: new Date('04/14/2022'),
        customer: 'Gussy',
        type: 'Wanda',
        saler: 'Marya',
        pay: 4,
      },
      {
        id: 2,
        salesDate: new Date('06/19/2021'),
        customer: 'Steffane',
        type: 'Tabbatha',
        saler: 'Belicia',
        pay: 49,
      },
      {
        id: 3,
        salesDate: new Date('04/17/2022'),
        customer: 'Lauren',
        type: 'Glynis',
        saler: 'Nara',
        pay: 65,
      },
      {
        id: 4,
        salesDate: new Date('12/14/2021'),
        customer: 'Charla',
        type: 'Jaimie',
        saler: 'Marybelle',
        pay: 70,
      },
      {
        id: 5,
        salesDate: new Date('06/21/2021'),
        customer: 'Isabelita',
        type: 'Aurea',
        saler: 'Gabriell',
        pay: 67,
      },
      {
        id: 6,
        salesDate: new Date('01/31/2022'),
        customer: 'Adelaida',
        type: 'Karole',
        saler: 'Henrietta',
        pay: 20,
      },
      {
        id: 7,
        salesDate: new Date('01/09/2022'),
        customer: 'Theodosia',
        type: 'Viki',
        saler: 'Kimberlyn',
        pay: 44,
      },
      {
        id: 8,
        salesDate: new Date('07/06/2021'),
        customer: 'Stace',
        type: 'Lizzie',
        saler: 'Corenda',
        pay: 19,
      },
      {
        id: 9,
        salesDate: new Date('07/23/2021'),
        customer: 'Andria',
        type: 'Pavla',
        saler: 'Marylynne',
        pay: 91,
      },
      {
        id: 10,
        salesDate: new Date('06/16/2021'),
        customer: 'Roobbie',
        type: 'Kora',
        saler: 'Malia',
        pay: 3,
      },
    ]);
  }, [filters]);

  const cells = useMemo(() => getCells(), []);

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

  const renderAction = (row: ISalesOrder) => {
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
        title="Danh sách hóa đơn bán hàng"
        placeHolder="Tìm kiếm hóa đơn"
        onSearch={handleSearch}
        searchText={filters.searchText}
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

      <TableContent total={salesOrder.length} loading={loading}>
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
                {salesOrder.map((item, index) => {
                  const { id, salesDate, customer, type, saler, pay } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{id}</TableCell>
                      <TableCell>
                        {moment(salesDate).format('DD/MM/YYYY HH:MM')}
                      </TableCell>
                      <TableCell>{customer}</TableCell>
                      <TableCell>{type}</TableCell>
                      <TableCell>{saler}</TableCell>
                      <TableCell>{numberFormat(pay)}</TableCell>
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
