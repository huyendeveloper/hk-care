import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Backdrop,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { LinkIconButton, Scrollbar } from 'components/common';
import { BlockDialog, DeleteDialog, UnBlockDialog } from 'components/Dialog';
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
import { IProduct } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  changeStatus,
  deleteProduct,
  getAllProduct,
} from 'redux/slices/product';
import { ClickEventCurrying } from 'types';
import type { FilterParams } from 'types/common';
import { numberFormat } from 'utils/numberFormat';
import FormDialog from '../FormDialog';

const getCells = (): Cells<IProduct> => [
  { id: 'id', label: 'STT' },
  { id: 'name', label: 'Tên sản phẩm' },
  { id: 'productGroup', label: 'Nhóm sản phẩm' },
  { id: 'importPrice', label: 'Giá nhập' },
  { id: 'price', label: 'Giá bán' },
  { id: 'hidden', label: 'Hoạt động' },
  { id: 'hidden', label: 'Thao tác' },
];

interface IProps {
  supplierId?: number;
  active?: number;
}

const TableData = ({ supplierId, active = 1 }: IProps) => {
  const dispatch = useDispatch();
  const setNotification = useNotification();

  const [currentID, setCurrentID] = useState<number | null>(null);
  const [productList, setProductList] = useState<IProduct[]>([]);
  const [openBlockDialog, setOpenBlockDialog] = useState<boolean>(false);
  const [openUnBlockDialog, setOpenUnBlockDialog] = useState<boolean>(false);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterParams>({
    ...defaultFilters,
    supplierId,
  });

  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getAllProduct(filters));

    if (error) {
      setNotification({ error: 'Lỗi!' });
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

  const handleDelete = async () => {
    if (!currentID) return;
    handleCloseDeleteDialog();
    setShowBackdrop(true);
    // @ts-ignore
    const { error } = await dispatch(deleteProduct(currentID));
    if (error) {
      setNotification({ error: 'Lỗi!' });
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

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleSearch = (searchText: string) => {
    setFilters((state) => ({
      ...state,
      searchText,
    }));
  };

  const handleOpenCreateDialog = () => {
    setCurrentID(null);
    setOpenFormDialog(true);
  };

  const handleOpenUpdateDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenFormDialog(true);
  };

  const handleOpenBlockDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenBlockDialog(true);
  };

  const handleOpenUnBlockDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenUnBlockDialog(true);
  };

  const handleCloseBlockDialog = () => {
    setOpenBlockDialog(false);
  };

  const handleCloseUnBlockDialog = () => {
    setOpenUnBlockDialog(false);
  };

  const handleCloseFormDialog = (updated: boolean | undefined) => {
    setOpenFormDialog(false);
  };

  const handleBlock = async () => {
    if (!currentID) return;
    handleCloseBlockDialog();
    setShowBackdrop(true);
    const { error } = await dispatch(
      // @ts-ignore
      changeStatus({ id: currentID, status: true })
    );
    if (error) {
      setNotification({ error: 'Lỗi!' });
      setShowBackdrop(false);
      return;
    }
    setNotification({
      message: 'Vô hiệu hóa thành công!',
      severity: 'success',
    });
    fetchData();
    setShowBackdrop(false);
  };

  const handleUnBlock = async () => {
    if (!currentID) return;
    handleCloseUnBlockDialog();
    setShowBackdrop(true);
    const { error } = await dispatch(
      // @ts-ignore
      changeStatus({ id: currentID, status: false })
    );
    if (error) {
      setNotification({ error: 'Lỗi!' });
      setShowBackdrop(false);
      return;
    }
    setNotification({
      message: 'Kích hoạt thành công!',
      severity: 'success',
    });

    fetchData();
    setShowBackdrop(false);
  };

  const handleOpenDeleteDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenDeleteDialog(true);
  };

  const renderAction = (row: IProduct) => {
    return (
      <>
        <LinkIconButton to={`/hk_group/product/list/${row.id}`}>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </LinkIconButton>

        <IconButton onClick={handleOpenUpdateDialog(row.id)}>
          <EditIcon />
        </IconButton>

        {row.hidden ? (
          <>
            <IconButton onClick={handleOpenUnBlockDialog(row.id)}>
              <CheckIcon />
            </IconButton>
            {/* <IconButton onClick={handleOpenDeleteDialog(row.id)}>
              <DeleteIcon />
            </IconButton> */}
          </>
        ) : (
          <IconButton onClick={handleOpenBlockDialog(row.id)}>
            <BlockIcon />
          </IconButton>
        )}
      </>
    );
  };

  return (
    <TableWrapper sx={{ height: 1, minHeight: '60vh' }} component={Paper}>
      <TableSearchField
        title="Danh sách sản phẩm"
        placeHolder="Tìm kiếm sản phẩm"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        {active === 1 && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            sx={{ fontSize: '1rem' }}
          >
            Thêm mới sản phẩm
          </Button>
        )}
      </TableSearchField>

      <TableContent total={productList.length} loading={loading}>
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
                {productList.map((item, index) => {
                  const { id, name, productGroup, importPrice, price, hidden } =
                    item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{productGroup}</TableCell>
                      <TableCell>{numberFormat(importPrice)}</TableCell>
                      <TableCell>{numberFormat(price)}</TableCell>
                      <TableCell>
                        {hidden ? (
                          <Button color="error">Không</Button>
                        ) : (
                          <Button>Có</Button>
                        )}
                      </TableCell>
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
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
        />
      </TableContent>

      <BlockDialog
        id={currentID}
        tableName="sản phẩm"
        name={productList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseBlockDialog}
        open={openBlockDialog}
        handleBlock={handleBlock}
      />

      <UnBlockDialog
        id={currentID}
        tableName="sản phẩm"
        name={productList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseUnBlockDialog}
        open={openUnBlockDialog}
        handleUnBlock={handleUnBlock}
      />

      <FormDialog
        supplierId={supplierId}
        currentID={currentID}
        open={openFormDialog}
        handleClose={handleCloseFormDialog}
        fetchData={fetchData}
      />

      <DeleteDialog
        id={currentID}
        tableName="sản phẩm"
        name={productList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        handleDelete={handleDelete}
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
