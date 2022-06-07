import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
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
import { DeleteDialog } from 'components/Dialog';
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
import { deleteProductList, getAllProduct } from 'redux/slices/productList';
import { RootState } from 'redux/store';
import { ClickEventCurrying } from 'types';
import type { FilterParams } from 'types/common';
import { numberFormat } from 'utils/numberFormat';
import FormDialog from '../FormDialog';

const getCells = (): Cells<IProductList> => [
  { id: 'productId', label: 'STT' },
  { id: 'productName', label: 'Tên sản phẩm' },
  { id: 'mesure', label: 'Đơn vị' },
  { id: 'productGroup', label: 'Nhóm sản phẩm' },
  { id: 'stockQuantity', label: 'Hàng tồn' },
  { id: 'importPrice', label: 'Giá nhập' },
  { id: 'price', label: 'Giá bán' },
  { id: 'price', label: 'Thao tác' },
];

interface IProps {
  active?: number;
}

const TableData = ({ active = 1 }: IProps) => {
  const dispatch = useDispatch();
  const setNotification = useNotification();

  const [currentID, setCurrentID] = useState<number | null>(null);
  const [productList, setProductList] = useState<IProductList[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState<number>(0);
  const { loading } = useSelector((state: RootState) => state.productList);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getAllProduct(filters));

    if (error) {
      setNotification({
        error: 'Lỗi khi tải danh sách sản phẩm!',
      });
      return;
    }
    setProductList(payload.productList);
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

  const handleOpenDeleteDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    if (!currentID) return;

    handleCloseDeleteDialog();
    // @ts-ignore
    const { error } = await dispatch(deleteProductList(currentID));
    if (error) {
      setNotification({ error: 'Lỗi khi xóa sản phẩm ra khỏi danh sách bán!' });
      return;
    }
    setNotification({
      message: 'Xóa thành công!',
      severity: 'success',
    });

    setProductList(productList.filter((x) => x.productId !== currentID));
  };

  const handleCloseUpdateDialog = () => {
    setOpenFormDialog(false);
    fetchData();
  };

  const renderAction = (row: IProductList) => {
    return (
      <>
        <LinkIconButton to={`${row.productId}`}>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </LinkIconButton>

        {(!row.stockQuantity || !(row.stockQuantity > 0)) && (
          <IconButton onClick={handleOpenDeleteDialog(row.productId)}>
            <DeleteIcon />
          </IconButton>
        )}
      </>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title=" "
        placeHolder="Tìm kiếm sản phẩm"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        {active === 1 && (
          <LinkButton
            variant="outlined"
            startIcon={<AddIcon />}
            to="/hk_care/product/list/create"
            sx={{ fontSize: '1rem' }}
          >
            Đăng ký sản phẩm
          </LinkButton>
        )}
      </TableSearchField>

      <TableContent total={productList.length} loading={loading}>
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
                {productList.map((item, index) => {
                  const {
                    productId,
                    productName,
                    productGroup,
                    importPrice,
                    price,
                    mesure,
                    stockQuantity,
                  } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={productId}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{productName}</TableCell>
                      <TableCell>{mesure}</TableCell>
                      <TableCell>{productGroup}</TableCell>
                      <TableCell>{stockQuantity}</TableCell>
                      <TableCell>{numberFormat(importPrice)}</TableCell>
                      <TableCell>{numberFormat(price)}</TableCell>

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
          totalPages={totalRows}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          rowsPerPage={filters.pageSize}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </TableContent>

      <DeleteDialog
        id={currentID}
        tableName="sản phẩm"
        name={productList.find((x) => x.productId === currentID)?.productName}
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        handleDelete={handleDelete}
        spanContent=" ra khỏi danh sách bán"
      />

      <FormDialog
        // @ts-ignore
        currentID={currentID}
        open={openFormDialog}
        handleClose={handleCloseUpdateDialog}
      />
    </TableWrapper>
  );
};

export default TableData;
