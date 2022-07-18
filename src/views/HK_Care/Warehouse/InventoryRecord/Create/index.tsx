import { yupResolver } from '@hookform/resolvers/yup';
import DownloadIcon from '@mui/icons-material/Download';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { LinkButton, Scrollbar } from 'components/common';
import PageWrapperFullwidth from 'components/common/PageWrapperFullwidth';
import {
  ControllerMultiFile,
  ControllerTextarea,
  FormContent,
  FormFooter,
  FormHeader,
  FormLabel,
  FormPaperGrid,
  Selecter,
} from 'components/Form';
import { TableContent, TableWrapper } from 'components/Table';
import TableHeader, { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IInventoryRecord, IInventoryRecordProduct } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAllProduct } from 'redux/slices/exportCancel';
import { RootState } from 'redux/store';
import { FilterParams } from 'types';
import { numberFormat } from 'utils/numberFormat';
import * as yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import MapDialog from './MapDialog';

interface IProductListName {
  id: number;
  name: string;
}

interface IDetailAdd {
  productId: number | null;
  productGroupId: number | null;
}

const getCells = (): Cells<IInventoryRecordProduct> => [
  { id: 'id', label: 'STT' },
  { id: 'id', label: '' },
  { id: 'id', label: 'Tên SP' },
  { id: 'id', label: 'Đ.Vị' },
  {
    id: 'id',
    label: (
      <>
        Tồn
        <br />
        TM
      </>
    ),
  },
  {
    id: 'id',
    label: (
      <>
        Tồn
        <br />
        TT
      </>
    ),
  },
  { id: 'id', label: 'C.L' },
  { id: 'id', label: 'Giá nhập' },
  { id: 'id', label: 'Tiền lệch' },
  { id: 'id', label: 'Giá bán' },
  { id: 'id', label: 'D.T.dự tính' },
];

const validationSchema = yup.object().shape({});

const Create = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const setNotification = useNotification();

  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [productList, setProductList] = useState<IProductListName[]>([]);
  const [files, setFiles] = useState<File[] | object[]>([]);
  const [openMapDialog, setOpenMapDialog] = useState<boolean>(false);
  const [inventoryRecordProducts, setInventoryRecordProducts] = useState<
    IInventoryRecordProduct[]
  >([]);
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const { loading: loadingProduct } = useSelector(
    (state: RootState) => state.productList
  );
  const [detailAdd, setDetailAdd] = useState<IDetailAdd>({
    productId: null,
    productGroupId: null,
  });

  const cells = useMemo(() => getCells(), []);

  const { control, setValue, getValues, handleSubmit, reset } =
    useForm<IInventoryRecord>({
      mode: 'onChange',
      resolver: yupResolver(validationSchema),
      defaultValues: validationSchema.getDefault(),
    });

  const { fields, append, remove } = useFieldArray<IInventoryRecord>({
    control,
    // @ts-ignore
    name: `inventoryRecordProducts`,
  });

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getAllProduct(filters));

    if (error) {
      setNotification({ error: 'Lỗi!' });
      return;
    }

    setProductList(payload.productList);
  };

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
      sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };

  useEffect(() => {
    fetchData();
    setInventoryRecordProducts([
      {
        id: 1,
        productName: 'productName1',
        measureName: 'Thùng',
        stockQuantityApp: 1,
        realStockQuantity: 1,
        importPrice: 1,
        price: 1,
      },
      {
        id: 2,
        productName: 'productName2',
        measureName: 'Thùng',
        stockQuantityApp: 2,
        realStockQuantity: 2,
        importPrice: 2,
        price: 2,
      },
      {
        id: 3,
        productName: 'productName3',
        measureName: 'Thùng',
        stockQuantityApp: 3,
        realStockQuantity: 3,
        importPrice: 3,
        price: 3,
      },
      {
        id: 4,
        productName: 'productName4',
        measureName: 'Thùng',
        stockQuantityApp: 4,
        realStockQuantity: 4,
        importPrice: 4,
        price: 4,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addProduct = async () => {};

  const handleCloseDialog = () => {
    setOpenMapDialog(false);
  };

  return (
    <PageWrapperFullwidth title={id ? 'Cập nhật hóa đơn' : 'Thêm bản kiểm kho'}>
      <Stack gap={2}>
        <Stack
          flexDirection="row"
          alignItems="flex-start"
          justifyContent="flex-end"
          height="min-content"
        >
          <Button onClick={() => setOpenMapDialog(true)}>
            <LocationOnIcon />
            Sơ đồ kệ thuốc
          </Button>
        </Stack>
        <FormPaperGrid>
          <FormHeader title="Danh sách sản phẩm" />
          <FormContent>
            <Grid container spacing={2} mb={2} alignItems="flex-end">
              <Grid item xs={12} md={5}>
                <FormLabel title="Tìm kiếm sản phẩm" name="name" />
                <Selecter
                  renderValue="id"
                  options={productList}
                  renderLabel={(field) => field.name}
                  noOptionsText="Không tìm thấy sản phẩm"
                  placeholder=""
                  onChangeSelect={(value: number | null) =>
                    setDetailAdd({ ...detailAdd, productId: value })
                  }
                  defaultValue=""
                  loading={loadingProduct}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <FormLabel title="Chọn nhóm sản phẩm" name="name" />
                <Selecter
                  renderValue="id"
                  options={productList}
                  renderLabel={(field) => field.name}
                  noOptionsText="Không tìm thấy sản phẩm"
                  placeholder=""
                  onChangeSelect={(value: number | null) =>
                    setDetailAdd({ ...detailAdd, productId: value })
                  }
                  defaultValue=""
                  loading={loadingProduct}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <LoadingButton
                  onClick={addProduct}
                  loading={loadingAdd}
                  loadingPosition="start"
                  startIcon={<></>}
                  sx={{ height: '40px', width: '100px', float: 'right' }}
                >
                  Kiểm kê
                </LoadingButton>
              </Grid>
            </Grid>
            <Stack flexDirection="row" justifyContent="flex-end" mb={2}>
              <LoadingButton
                onClick={addProduct}
                loading={loadingAdd}
                loadingPosition="start"
                startIcon={<DownloadIcon />}
                sx={{ height: '40px', width: '100px' }}
                variant="outlined"
              >
                PDF
              </LoadingButton>
            </Stack>
            <Grid item xs={12} gap={2}>
              <TableWrapper sx={{ height: 1, mb: 2 }} component={Paper}>
                <TableContent total={1} noDataText=" " loading={false}>
                  <TableContainer sx={{ p: 1.5, minHeight: '40vh' }}>
                    <Scrollbar>
                      <Table sx={{ minWidth: 'max-content' }} size="small">
                        <TableHeader
                          cells={cells}
                          onSort={handleOnSort}
                          sortDirection={filters.sortDirection}
                          sortBy={filters.sortBy}
                        />

                        <TableBody>
                          {inventoryRecordProducts.map((item, index) => {
                            const {
                              productName,
                              measureName,
                              stockQuantityApp,
                              realStockQuantity,
                              importPrice,
                              price,
                            } = item;
                            return (
                              <TableRow hover tabIndex={-1} key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell
                                  sx={{ padding: 0, width: 'fit-content' }}
                                >
                                  <IconButton
                                    sx={{ mr: 0.5, p: 0 }}
                                    color="inherit"
                                    // onClick={handleClose}
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </TableCell>
                                <TableCell>{productName}</TableCell>
                                <TableCell>{measureName}</TableCell>
                                <TableCell>
                                  {numberFormat(stockQuantityApp)}
                                </TableCell>
                                <TableCell>
                                  {numberFormat(realStockQuantity)}
                                </TableCell>
                                <TableCell>
                                  {numberFormat(
                                    stockQuantityApp - realStockQuantity
                                  )}
                                </TableCell>
                                <TableCell>
                                  {numberFormat(importPrice)}
                                </TableCell>
                                <TableCell>
                                  {numberFormat(
                                    importPrice *
                                      (stockQuantityApp - realStockQuantity)
                                  )}
                                </TableCell>
                                <TableCell>{numberFormat(price)}</TableCell>
                                <TableCell>
                                  {numberFormat(
                                    price *
                                      (stockQuantityApp - realStockQuantity)
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Scrollbar>
                  </TableContainer>
                </TableContent>
              </TableWrapper>
              <table style={{ float: 'right' }}>
                <tbody>
                  <tr>
                    <td style={{ paddingRight: '50px' }}>
                      Tổng lệch doanh thu:
                    </td>
                    <td>
                      {numberFormat(
                        inventoryRecordProducts.reduce(
                          (pre, cur) =>
                            pre +
                            cur.price *
                              (cur.stockQuantityApp - cur.realStockQuantity),
                          0
                        )
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <Grid container>
                <Grid item xs={12} md={6} pr={2}>
                  <FormLabel title="Ghi chú" name="description" />
                  <ControllerTextarea
                    maxRows={11}
                    minRows={11}
                    name="description"
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={6} pl={2}>
                  <FormLabel title="File đính kèm" name="description" />
                  <ControllerMultiFile
                    files={files}
                    setFiles={setFiles}
                    max={1}
                    accept="image/*,application/pdf"
                    message="Tài liệu đính kèm chỉ cho phép file pdf và ảnh."
                  />
                </Grid>
              </Grid>
            </Grid>
          </FormContent>
          <FormFooter>
            <LinkButton to="/hk_care/warehouse/inventory_record">
              Hủy
            </LinkButton>
            <LoadingButton type="submit">
              {id ? 'Lưu' : 'Chốt kiểm kê'}
            </LoadingButton>
          </FormFooter>
        </FormPaperGrid>
      </Stack>
      <MapDialog open={openMapDialog} onClose={handleCloseDialog} />
    </PageWrapperFullwidth>
  );
};

export default Create;
