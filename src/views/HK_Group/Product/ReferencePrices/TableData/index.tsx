import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { Scrollbar } from 'components/common';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableSearchField,
  TableWrapper,
} from 'components/Table';
import TableFilters from 'components/Table/TableFilters';
import { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { IReferencePrices } from 'interface';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { FilterParams } from 'types';

const getCells = (): Cells<IReferencePrices> => [
  // { id: 'id', label: 'STT' },
  // { id: 'name', label: 'Tên sản phẩm' },
  // { id: 'productGroup', label: 'Nhóm sản phẩm' },
  // { id: 'importPrice', label: 'Giá nhập' },
  // { id: 'price', label: 'Giá bán' },
  // { id: 'hidden', label: 'Hoạt động' },
  // { id: 'hidden', label: 'Thao tác' },
];

const TableData = () => {
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [referencePrices, setReferencePrices] = useState<IReferencePrices[]>(
    []
  );
  const { loading } = useSelector((state: RootState) => state.product);

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

  const cells = useMemo(() => getCells(), []);

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Giá tham chiếu"
        placeHolder="Tìm kiếm sản phẩm"
        onSearch={handleSearch}
        searchText={filters.searchText}
      />
      <TableContent total={referencePrices.length} loading={loading}>
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
                {referencePrices.map((item, index) => {
                  const { id } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      {/* <TableCell>{name}</TableCell>
                      <TableCell>{productGroup}</TableCell>
                      <TableCell>{importPrice}</TableCell>
                      <TableCell>{price}</TableCell> */}
                      {/* <TableCell>
                        {hidden ? (
                          <Button color="error">Không</Button>
                        ) : (
                          <Button>Có</Button>
                        )}
                      </TableCell> */}
                      {/* <TableCell align="left">{renderAction(item)}</TableCell> */}
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
