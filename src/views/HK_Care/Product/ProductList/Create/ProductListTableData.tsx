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
import { useNotification } from 'hooks';
import { IProductList } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import type { FilterParams } from 'types/common';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';

const getCells = (): Cells<IProductList> => [
  { id: 'productId', label: 'STT' },
  { id: 'productName', label: 'Tên sản phẩm' },
  { id: 'productName', label: 'Thao tác' },
];

interface IProps {
  handleUnregist: (item: IProductList) => void;
  handleCancelRegist: (id: number) => void;
  registerList: IProductList[];
}

const ProductListTableData = ({
  handleUnregist,
  registerList,
  handleCancelRegist,
}: IProps) => {
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const { loading } = useSelector((state: RootState) => state.productList);
  const [totalRows, setTotalRows] = useState<number>(0);

  const fetchData = async () => {
    setTotalRows(registerList.length);
  };

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

      <TableContent total={registerList.length} loading={loading}>
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
                {registerList
                  .filter((item) =>
                    item.productName.startsWith(filters.searchText)
                  )
                  .splice((filters.pageIndex - 1) * 10, filters.pageIndex * 10)
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
              item.productName.startsWith(filters.searchText)
            ).length
          }
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          rowsPerPage={filters.pageSize}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </TableContent>
    </TableWrapper>
  );
};

export default ProductListTableData;
