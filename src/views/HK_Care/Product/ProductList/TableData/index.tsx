import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import {
  LinkButton,
  LinkIconButton,
  LoadingScreen,
  Scrollbar,
} from 'components/common';
import { DeleteDialog } from 'components/Dialog';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableSearchField,
  TableWrapper,
} from 'components/Table';
import TableBodyContent from 'components/Table/TableBodyContent';
import type { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IProductList } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteProductList, getAllProduct } from 'redux/slices/productList';
import { ClickEventCurrying } from 'types';
import type { FilterParams } from 'types/common';
import { numberFormat } from 'utils/numberFormat';
import QuotaUpdate from './NormUpdate';

const getCells = (): Cells<IProductList> => [
  { id: 'productId', label: 'STT' },
  { id: 'productName', label: 'Tên SP' },
  { id: 'mesure', label: 'Đơn vị' },
  { id: 'productGroup', label: 'Nhóm SP' },
  { id: 'stockQuantity', label: 'Hàng tồn' },
  { id: 'importPrice', label: 'Giá nhập' },
  { id: 'price', label: 'Giá bán' },
  { id: 'norm', label: 'Định mức' },
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
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);

  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getAllProduct(filters));

    if (error) {
      setNotification({ error: 'Hệ thống đang gặp sự cố' });
      setLoading(false);
      return;
    }
    setProductList(payload.productList);
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
    setShowBackdrop(true);
    // @ts-ignore
    const { error } = await dispatch(deleteProductList(currentID));
    if (error) {
      setNotification({ error: 'Hệ thống đang gặp sự cố' });
      setShowBackdrop(false);
      return;
    }
    setNotification({
      message: 'Xóa thành công!',
      severity: 'success',
    });

    fetchData();
    setShowBackdrop(false);
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
        title="Danh sách sản phẩm"
        placeHolder="Tìm kiếm sản phẩm"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        {active === 1 && (
          <LinkButton
            variant="outlined"
            startIcon={<AddIcon />}
            to="create"
            sx={{ fontSize: '1rem' }}
          >
            Đăng ký sản phẩm
          </LinkButton>
        )}
      </TableSearchField>

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
              <TableBodyContent
                total={productList.length}
                loading={loading}
                colSpan={cells.length}
              >
                {productList.map((item, index) => {
                  const {
                    id,
                    productName,
                    productGroup,
                    importPrice,
                    price,
                    mesure,
                    stockQuantity,
                    norm,
                  } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{productName}</TableCell>
                      <TableCell>{mesure}</TableCell>
                      <TableCell>{productGroup}</TableCell>
                      <TableCell>{stockQuantity}</TableCell>
                      <TableCell>{numberFormat(importPrice)}</TableCell>
                      <TableCell>{numberFormat(price)}</TableCell>
                      <TableCell sx={{ width: '120px' }}>
                        <QuotaUpdate
                          norm={norm}
                          productId={id}
                          showBackdrop={showBackdrop}
                          setShowBackdrop={setShowBackdrop}
                        />
                      </TableCell>
                      <TableCell align="left">{renderAction(item)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBodyContent>
            </TableBody>
          </Table>
        </Scrollbar>
        {loading && <LoadingScreen />}
      </TableContainer>

      <TablePagination
        pageIndex={filters.pageIndex}
        totalPages={totalRows}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={filters.pageSize}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />

      <DeleteDialog
        id={currentID}
        tableName="sản phẩm"
        name={productList.find((x) => x.productId === currentID)?.productName}
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        handleDelete={handleDelete}
        spanContent=" ra khỏi danh sách bán"
      />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBackdrop}
        onClick={() => setShowBackdrop(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </TableWrapper>
  );
};

export default TableData;
