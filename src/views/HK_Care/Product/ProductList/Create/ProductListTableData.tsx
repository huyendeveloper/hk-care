import CloseIcon from '@mui/icons-material/Close';
import {
  IconButton,
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
import type { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { IProductList } from 'interface';
import { useMemo, useState } from 'react';
import type { FilterParams } from 'types/common';

const getCells = (): Cells<IProductList> => [
  { id: 'productId', label: 'STT' },
  { id: 'productName', label: 'Tên sản phẩm' },
  { id: 'productName', label: 'Thao tác' },
];

interface IProps {
  handleCancelRegist: (id: number) => void;
  registerList: IProductList[];
}

const ProductListTableData = ({ registerList, handleCancelRegist }: IProps) => {
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);

  const cells = useMemo(() => getCells(), []);

  const handleSearch = (searchText: string) => {
    setFilters((state) => ({
      ...state,
      searchText,
    }));
  };

  const handleChangeRowsPerPage = (rowsPerPage: number) => {
    setFilters((state) => ({
      ...state,
      pageIndex: 1,
      pageSize: rowsPerPage,
    }));
  };

  const handleChangePage = (pageIndex: number) => {
    setFilters((state) => ({
      ...state,
      pageIndex,
    }));
  };

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
    }));
  };

  const renderAction = (row: IProductList) => {
    return (
      <IconButton onClick={() => handleCancelRegist(row.productId)}>
        <CloseIcon />
      </IconButton>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Danh sách sản phẩm"
        placeHolder="Tìm kiếm sản phẩm"
        onSearch={handleSearch}
        searchText={filters.searchText}
      />

      <TableContent
        total={
          registerList
            .filter((item) =>
              item.productName
                .toLocaleLowerCase()
                .includes(filters.searchText.toLowerCase())
            )
            .splice(
              (filters.pageIndex - 1) * filters.pageSize,
              filters.pageIndex * filters.pageSize
            ).length
        }
        loading={false}
      >
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
                {registerList
                  .filter((item) =>
                    item.productName
                      .toLocaleLowerCase()
                      .includes(filters.searchText.toLowerCase())
                  )
                  .splice(
                    (filters.pageIndex - 1) * filters.pageSize,
                    filters.pageIndex * filters.pageSize
                  )
                  .map((item, index) => {
                    const { productId, productName } = item;
                    return (
                      <TableRow hover tabIndex={-1} key={productId}>
                        <TableCell>
                          {(filters.pageIndex - 1) * filters.pageSize +
                            index +
                            1}
                        </TableCell>
                        <TableCell>{productName}</TableCell>

                        <TableCell align="left">{renderAction(item)}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePagination
          pageIndex={filters.pageIndex}
          totalPages={
            registerList.filter((item) =>
              item.productName
                .toLocaleLowerCase()
                .includes(filters.searchText.toLowerCase())
            ).length
          }
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          rowsPerPage={filters.pageSize}
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
        />
      </TableContent>
    </TableWrapper>
  );
};

export default ProductListTableData;
