import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { LinkButton, Scrollbar } from 'components/common';
import { TableContent, TableHeader, TableWrapper } from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { ISalesOrder, OrderDetailDtos } from 'interface';
import { useMemo, useState } from 'react';
import { FilterParams } from 'types';
import { numberFormat } from 'utils/numberFormat';

const getCells = (): Cells<ISalesOrder> => [
  {
    id: 'id',
    label: 'STT',
  },
  {
    id: 'id',
    label: 'Tên sản phẩm',
  },
  {
    id: 'saleDate',
    label: 'Đơn vị',
  },
  {
    id: 'customer',
    label: 'Số lượng',
  },
  {
    id: 'type',
    label: 'Đơn giá',
  },
  {
    id: 'saler',
    label: 'Chiết khấu',
  },
  {
    id: 'pay',
    label: 'Thành tiền',
  },
  {
    id: 'saler',
    label: 'Liều dùng',
  },
];

interface IProps {
  orderDetailDtos: OrderDetailDtos[];
}

const TableData = ({ orderDetailDtos }: IProps) => {
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);

  const cells = useMemo(() => getCells(), []);

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
    }));
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableContent total={orderDetailDtos.length} loading={false}>
        <TableContainer sx={{ p: 1.5, maxHeight: '100vh' }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Thông tin sản phẩm
          </Typography>
          <Scrollbar>
            <Table sx={{ minWidth: 'max-content' }} size="small">
              <TableHeader
                cells={cells}
                onSort={handleOnSort}
                sortDirection={filters.sortDirection}
                sortBy={filters.sortBy}
              />

              <TableBody>
                {orderDetailDtos.map((item, index) => {
                  const {
                    productId,
                    productName,
                    quantity,
                    price,
                    discount,
                    measureName,
                    mor,
                    noon,
                    night,
                    description,
                  } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={productId}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{productName}</TableCell>
                      <TableCell>{measureName}</TableCell>
                      <TableCell>{quantity}</TableCell>
                      <TableCell>{numberFormat(price)}</TableCell>
                      <TableCell>{numberFormat(discount)}</TableCell>
                      <TableCell>
                        {numberFormat(quantity * price - discount)}
                      </TableCell>
                      <TableCell>
                        <TableContainer>
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell
                                  sx={{
                                    padding: '5px 8px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  Sáng
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: '5px 8px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  Trưa
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: '5px 8px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  Tối
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: '5px 8px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  Ghi chú
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  sx={{
                                    borderBottom: 'none',
                                    width: '70px !important',
                                    padding: '0 8px',
                                  }}
                                >
                                  <Box sx={{ minHeight: '22px' }}>{mor}</Box>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderBottom: 'none',
                                    width: '70px !important',
                                    padding: '0 8px',
                                  }}
                                >
                                  {noon}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderBottom: 'none',
                                    width: '70px !important',
                                    padding: '0 8px',
                                  }}
                                >
                                  {night}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderBottom: 'none',
                                    width: '70px !important',
                                    padding: '0 8px',
                                  }}
                                >
                                  {description}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Scrollbar>
          <Stack flexDirection="row" sx={{ mt: 3 }} justifyContent="flex-end">
            <LinkButton to="/hk_care/sales/order">Quay lại</LinkButton>
          </Stack>
        </TableContainer>
      </TableContent>
    </TableWrapper>
  );
};

export default TableData;
