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
import { fil } from 'date-fns/locale';
import { useNotification } from 'hooks';
import { ISalesOrder } from 'interface';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSaleOrders } from 'redux/slices/salesOrder';
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
    id: 'saleDate',
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
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [salesOrder, setSalesOrder] = useState<ISalesOrder[]>([]);
  const { loading } = useSelector((state: RootState) => state.usage);
  const [totalRows, setTotalRows] = useState<number>(0);
  const setNotification = useNotification();

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getAllSaleOrders(filters));

    if (error) {
      setNotification({
        error: 'Lỗi!',
      });
      return;
    }
    setSalesOrder(payload.salesOrder);
    setTotalRows(payload.totalCount);
  };

  useEffect(() => {
    fetchData();
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
        <LinkIconButton to={`${row.orderId}`}>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </LinkIconButton>
        <LinkIconButton to={`${row.orderId}/update`}>
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
                  const {
                    id,
                    saleDate,
                    customerName,
                    orderType,
                    userName,
                    giveMoney,
                    code,
                  } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={code}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{code}</TableCell>
                      <TableCell>
                        {moment(saleDate).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                      <TableCell>{customerName}</TableCell>
                      <TableCell>{orderType}</TableCell>
                      <TableCell>{userName}</TableCell>
                      <TableCell>{numberFormat(giveMoney)}</TableCell>
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
