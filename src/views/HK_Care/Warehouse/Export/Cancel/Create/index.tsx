import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  FormGroup,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { LinkButton, Scrollbar } from 'components/common';
import PageWrapperFullwidth from 'components/common/PageWrapperFullwidth';
import {
  ControllerTextarea,
  FormContent,
  FormFooter,
  FormHeader,
  FormLabel,
  FormPaperGrid,
  Selecter,
} from 'components/Form';
import { TableContent, TablePagination, TableWrapper } from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IExportCancel, IProductExportCancel } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createExportWH,
  getAllProduct,
  getGetDetail,
  updateExportCancel,
} from 'redux/slices/exportCancel';
import exportCancelService from 'services/exportCancel.service';
import { FilterParams } from 'types';
import * as yup from 'yup';
import TableHeader from '../components/TableHeader';
import ReceiptEntity from './ReceiptEntity';
import TotalBill from './TotalBill';

const validationSchema = yup.object().shape({});

interface IDetailAdd {
  productId: number | null;
  from: number | null;
  to: number | null;
}

interface IProductListName {
  id: number;
  name: string;
}

const getCells = (): Cells<IProductExportCancel> => [
  { id: 'id', label: 'STT' },
  { id: 'productName', label: 'Tên SP' },
  { id: 'measureName', label: 'Đ.Vị' },
  { id: 'amount', label: 'SL' },
  { id: 'importPrice', label: 'Giá vốn' },
  { id: 'importPrice', label: 'Giá trị hủy' },
  { id: 'lotNumber', label: 'Số lô' },
  { id: 'creationTime', label: 'Ngày nhập' },
  { id: 'expiryDate', label: 'HSD' },
  { id: 'lotNumber', label: '' },
];

const fromList = [
  { id: -1, name: '<0' },
  { id: 0, name: '0' },
  { id: 3, name: '3' },
];
const toList = [
  { id: -1, name: '<0' },
  { id: 0, name: '0' },
  { id: 3, name: '3' },
  { id: 6, name: '6' },
  { id: 9, name: '9' },
  { id: 12, name: '12' },
  { id: 36, name: '36' },
];

const CreateForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setNotification = useNotification();

  const [productList, setProductList] = useState<IProductListName[]>([]);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [loadingExpiredProduct, setLoadingExpiredProduct] =
    useState<boolean>(false);
  const [loadingFetchData, setLoadingFetchData] = useState<boolean>(false);
  const [loadingFetchProducts, setLoadingFetchProducts] =
    useState<boolean>(false);
  const [detailAdd, setDetailAdd] = useState<IDetailAdd>({
    productId: null,
    from: null,
    to: null,
  });

  const cells = useMemo(() => getCells(), []);

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

  const { control, setValue, handleSubmit, reset } = useForm<IExportCancel>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const exportWHDetails = useWatch({
    control,
    name: 'exportWHDetails',
  });

  const { fields, append, remove } = useFieldArray<IExportCancel>({
    control,
    name: 'exportWHDetails',
  });

  const fetchDataUpdate = async () => {
    setLoadingFetchData(true);
    // @ts-ignore
    const { payload, error } = await dispatch(getGetDetail(id));
    if (error) {
      setNotification({
        error: 'Hệ thống đang gặp sự cố',
      });
      setLoadingFetchData(false);
      return;
    }
    const { totalFee, code, description, rotationPoint, exportWHDetails } =
      payload.exportCancel;

    reset({
      totalFee,
      code,
      description,
      rotationPoint,
      exportWHDetails,
    });
    setLoadingFetchData(false);
  };

  const fetchData = async () => {
    if (id) {
      fetchDataUpdate();
    }
    setLoadingFetchProducts(true);
    // @ts-ignore
    const { payload, error } = await dispatch(getAllProduct(filters));

    if (error) {
      setNotification({ error: 'Hệ thống đang gặp sự cố' });
      setLoadingFetchProducts(false);
      return;
    }

    setProductList(payload.productList);
    setLoadingFetchProducts(false);
  };

  useEffect(() => {
    if (detailAdd.from !== -1 && detailAdd.to === -1) {
      setDetailAdd({ ...detailAdd, to: 3 });
    }
  }, [detailAdd]);

  const fetchExpiredProduct = async () => {
    setLoadingExpiredProduct(true);
    try {
      const { data } = await exportCancelService.addToListExportCancel({
        productId: null,
        from: -1,
        to: -1,
      });
      if (data.length === 0) {
        // setNotification({ error: 'Không có sản phẩm nào!' });
        setLoadingExpiredProduct(false);
        return;
      }
      data.forEach((item: IProductExportCancel) => {
        // @ts-ignore
        if (!fields.some((e) => e.orderId === item.id)) {
          if (id) {
            // @ts-ignore
            append({ ...item, orderId: item.id, id: 0 });
          } else {
            // @ts-ignore
            append({ ...item, orderId: item.id });
          }
        }
      });
      setFilters({ ...filters, sortBy: '' });
    } catch (error) {
      setNotification({ error: 'Hệ thống đang gặp sự cố' });
    }
    setLoadingExpiredProduct(false);
  };

  useEffect(() => {
    fetchData();
    if (!id) {
      fetchExpiredProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: IExportCancel) => {
    setLoading(true);
    const newPayload = {
      ...data,
      totalFee:
        data.exportWHDetails.reduce(
          // @ts-ignore
          (prev, cur) =>
            prev + (Number(cur?.amount) || 0) * (Number(cur?.importPrice) || 0),
          0
        ) || 0,
      exportType: 4,
    };
    if (id) {
      const { error } = await dispatch(
        // @ts-ignore
        updateExportCancel({ ...newPayload, id })
      );
      if (error) {
        setNotification({ error: 'Hệ thống đang gặp sự cố' });
        setLoading(false);
        return;
      }
      setNotification({
        message: 'Cập nhật thành công',
        severity: 'success',
      });
      setLoading(false);
      return navigate(`/hk_care/warehouse/export/cancel`);
    }
    const { error } = await dispatch(
      // @ts-ignore
      createExportWH(newPayload)
    );
    if (error) {
      setNotification({ error: 'Hệ thống đang gặp sự cố' });
      setLoading(false);
      return;
    }
    setNotification({
      message: 'Thêm thành công',
      severity: 'success',
    });
    setLoading(false);
    return navigate(`/hk_care/warehouse/export/cancel`);
  };

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
      sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };

  const addProduct = async () => {
    if (detailAdd.from === null || detailAdd.to === null) {
      setNotification({ error: 'Chưa chọn khoảng thời gian sử dụng!' });
      return;
    }
    setLoadingAdd(true);
    try {
      const { data } = await exportCancelService.addToListExportCancel(
        detailAdd
      );
      if (data.length === 0) {
        setNotification({ error: 'Không có sản phẩm nào!' });
        setLoadingAdd(false);
        return;
      }
      data.forEach((item: IProductExportCancel) => {
        // @ts-ignore
        if (!fields.some((e) => e.orderId === item.id)) {
          if (id) {
            // @ts-ignore
            append({ ...item, orderId: item.id, id: 0 });
          } else {
            // @ts-ignore
            append({ ...item, orderId: item.id });
          }
        }
      });
      setFilters({ ...filters, sortBy: '' });
    } catch (error) {
      setNotification({ error: 'Hệ thống đang gặp sự cố' });
      setLoadingAdd(false);
    }
    setLoadingAdd(false);
  };

  const handleSort = () => {
    if (filters.sortBy) {
      const fieldsSort = [...fields];
      fieldsSort.sort((a, b) => {
        // @ts-ignore
        const c = new Date(a[filters.sortBy]);
        // @ts-ignore
        const d = new Date(b[filters.sortBy]);
        // @ts-ignore
        return c - d;
      });

      setValue(
        'exportWHDetails',
        filters.sortDirection === 'desc' ? fieldsSort.reverse() : fieldsSort
      );
    }
  };

  useEffect(() => {
    handleSort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.sortBy, filters.sortDirection]);

  return (
    <PageWrapperFullwidth title={id ? 'Cập nhật hóa đơn' : 'Thêm hóa đơn'}>
      {!id && (
        <Paper
          component="div"
          sx={{
            p: 2.5,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <FormLabel title="Thời gian sử dụng còn" name="name" />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Stack flexDirection="row" alignItems="center" gap="10px">
                    <FormLabel title="Từ:" name="name" />
                    <Selecter
                      options={fromList}
                      renderLabel={(field) => field.name}
                      noOptionsText="Không tìm thấy sản phẩm"
                      renderValue="id"
                      placeholder=""
                      defaultValue=""
                      onChangeSelect={(value: number | null) =>
                        setDetailAdd({ ...detailAdd, from: value })
                      }
                    />
                  </Stack>
                </Grid>
                <Grid item xs={6} sx={{ gap: '10px' }}>
                  <Stack flexDirection="row" alignItems="center" gap="10px">
                    <FormLabel title="Đến:" name="name" />
                    <Selecter
                      options={
                        detailAdd.from === -1 || detailAdd.from === null
                          ? toList
                          : [...toList].splice(2, toList.length)
                      }
                      renderLabel={(field) => field.name}
                      noOptionsText="Không tìm thấy sản phẩm"
                      renderValue="id"
                      placeholder=""
                      defaultValue=""
                      onChangeSelect={(value: number | null) =>
                        setDetailAdd({ ...detailAdd, to: value })
                      }
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={7}>
              <FormLabel title="Tìm kiếm sản phẩm" name="name" />
              <Grid container spacing={1}>
                <Grid item xs={8}>
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
                    loading={loadingFetchProducts}
                  />
                </Grid>
                <Grid item xs={4}>
                  <LoadingButton
                    onClick={addProduct}
                    loading={loadingAdd}
                    loadingPosition="start"
                    startIcon={<></>}
                    sx={{ height: 1, width: '100px' }}
                    disabled={loadingExpiredProduct}
                  >
                    Thêm
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      )}
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader title="Thông tin sản phẩm" />
        <FormContent>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ minHeight: '200px' }}>
                <TableWrapper sx={{ height: 1 }} component={Paper}>
                  <TableContent
                    total={1}
                    noDataText=" "
                    loading={loadingExpiredProduct || loadingFetchData}
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
                            {exportWHDetails &&
                              [...exportWHDetails]
                                .splice(
                                  (filters.pageIndex - 1) * filters.pageSize,
                                  filters.pageSize
                                )
                                .map((item, index) => (
                                  <ReceiptEntity
                                    item={item}
                                    key={index}
                                    index={
                                      (filters.pageIndex - 1) *
                                        filters.pageSize +
                                      index +
                                      1
                                    }
                                    remove={remove}
                                  />
                                ))}
                          </TableBody>
                        </Table>
                      </Scrollbar>
                    </TableContainer>
                  </TableContent>
                </TableWrapper>
              </Grid>
              <Grid container alignItems="center">
                <Grid item xs={12}>
                  <TablePagination
                    pageIndex={filters.pageIndex}
                    totalPages={fields.length}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    rowsPerPage={filters.pageSize}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                  />
                </Grid>
                <Grid item lg={9} xs={0}></Grid>
                <Grid item lg={3} xs={12} p={2}>
                  <TotalBill control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Ghi chú" name="description" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextarea
                    maxRows={11}
                    minRows={11}
                    name="description"
                    control={control}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}></Grid>
            </Grid>
          </FormGroup>
        </FormContent>
        <FormFooter>
          <LinkButton to="/hk_care/warehouse/export/cancel">Quay lại</LinkButton>

          <LoadingButton loading={loading} type="submit">
            {id ? 'Lưu' : 'Xuất hủy'}
          </LoadingButton>
        </FormFooter>
      </FormPaperGrid>
    </PageWrapperFullwidth>
  );
};

export default CreateForm;
