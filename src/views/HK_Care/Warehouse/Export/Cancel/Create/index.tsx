import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  FormGroup,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import Button from '@mui/material/Button';
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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createExportWH,
  getAllProduct,
  getGetDetail,
  updateExportCancel,
} from 'redux/slices/exportCancel';
import { RootState } from 'redux/store';
import exportCancelService from 'services/exportCancel.service';
import importReceiptService from 'services/importReceipt.service';
import { FilterParams } from 'types';
import * as yup from 'yup';
import TableHeader from '../components/TableHeader';
import ReceiptEntity from './ReceiptEntity';
import TotalBill from './TotalBill';

const validationSchema = yup.object().shape({
  exportWHDetails: yup.array().of(
    yup.object().shape({
      lotNumber: yup.string().required('Bắt buộc'),
    })
  ),
});

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
  { id: 'productName', label: 'Tên sản phẩm' },
  { id: 'measureName', label: 'Đơn vị' },
  { id: 'amount', label: 'Số lượng' },
  { id: 'importPrice', label: 'Giá vốn' },
  { id: 'importPrice', label: 'Giá trị hủy' },
  { id: 'lotNumber', label: 'Số lô' },
  { id: 'creationTime', label: 'Ngày nhập' },
  { id: 'expiryDate', label: 'Hạn sử dụng' },
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
  const { loading } = useSelector((state: RootState) => state.productList);
  const [files, setFiles] = useState<File[] | object[]>([]);
  const [pathFile, setPathFile] = useState<string>('');
  const [totalRows, setTotalRows] = useState<number>(0);
  const [detailAdd, setDetailAdd] = useState<IDetailAdd>({
    productId: null,
    from: -1,
    to: -1,
  });
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);

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

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const cells = useMemo(() => getCells(), []);

  const getPathFile = async () => {
    const { data } = await importReceiptService.getPathFileReceipt(files[0]);
    setPathFile(data);
  };

  useEffect(() => {
    if (files.length > 0) {
      // @ts-ignore
      if (files[0].type === 'application/pdf') {
        getPathFile();
      } else {
        // @ts-ignore
        setPathFile(files[0].name);
      }
    } else {
      setPathFile('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<IExportCancel>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const { fields, append, remove } = useFieldArray<IExportCancel>({
    control,
    name: 'exportWHDetails',
  });

  const fetchDataUpdate = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getGetDetail(id));
    if (error) {
      setNotification({
        error: 'Lỗi!',
      });
      return;
    }
    const {
      totalFee,
      code,
      description,
      from,
      to,
      rotationPoint,
      exportWHDetails,
    } = payload.exportCancel;

    reset({
      totalFee,
      code,
      description,
      from,
      to,
      rotationPoint,
      exportWHDetails,
    });
  };

  const fetchData = async () => {
    if (id) {
      fetchDataUpdate();
    }
    // @ts-ignore
    const { payload, error } = await dispatch(getAllProduct(filters));

    if (error) {
      setNotification({ error: 'Lỗi!' });
      return;
    }

    setProductList(payload.productList);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: IExportCancel) => {
    // @ts-ignore
    if (data?.exportWHDetails?.length < 1) {
      setNotification({ error: 'Bạn chưa nhập sản phẩm nào' });
      return;
    }
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
        setNotification({ error: 'Lỗi!' });
        return;
      }
      setNotification({
        message: 'Cập nhật thành công',
        severity: 'success',
      });
      return navigate(`/hk_care/warehouse/export/cancel`);
    }
    const { payload, error } = await dispatch(
      // @ts-ignore
      createExportWH(newPayload)
    );
    if (error) {
      setNotification({ error: 'Lỗi!' });
      return;
    }
    setNotification({
      message: 'Thêm thành công',
      severity: 'success',
    });
    return navigate(`/hk_care/warehouse/export/cancel`);
  };

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
      sortDirection:
        state.sortBy !== field
          ? 'asc'
          : state.sortDirection === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  const addProduct = async () => {
    if (!detailAdd.productId) {
      setNotification({
        message: 'Chưa chọn sản phẩm!',
        severity: 'warning',
      });
      return;
    }
    try {
      const { data } = await exportCancelService.addToListExportCancel(
        detailAdd
      );
      data.forEach((item: IProductExportCancel) => {
        // @ts-ignore
        if (!fields.some((e) => e.orderId === item.id)) {
          // @ts-ignore
          append({ ...item, orderId: item.id });
        }
      });
      setFilters({ ...filters, sortBy: '' });
    } catch (error) {
      setNotification({ error: 'Lỗi!' });
    }
  };

  const handleSort = () => {
    if (filters.sortBy) {
      const fieldsSort = [
        ...fields.sort((a, b) => {
          // @ts-ignore
          const c = a[filters.sortBy];
          // @ts-ignore
          const d = b[filters.sortBy];
          // @ts-ignore
          return c - d;
        }),
      ];
      setValue(
        'exportWHDetails',
        filters.sortDirection === 'desc' ? fieldsSort.reverse() : fieldsSort
      );
    }
  };

  const exportWHDetails = useWatch({
    control,
    name: 'exportWHDetails',
  });

  useEffect(() => {
    handleSort();
  }, [filters.sortBy, filters.sortDirection]);

  return (
    <PageWrapperFullwidth title={id ? 'Cập nhật hóa đơn' : 'Thêm hóa đơn'}>
      <Paper
        component="div"
        sx={{
          p: 2.5,
        }}
      >
        <Grid container spacing={2}>
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
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <FormLabel title="Thời gian sử dụng còn" name="name" />
            <Grid container spacing={1}>
              <Grid
                item
                xs={4}
                sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}
              >
                <FormLabel title="Từ:" name="name" />
                <Selecter
                  options={fromList}
                  renderLabel={(field) => field.name}
                  noOptionsText="Không tìm thấy sản phẩm"
                  renderValue="id"
                  placeholder=""
                  defaultValue={'<0'}
                  onChangeSelect={(value: number | null) =>
                    setDetailAdd({ ...detailAdd, from: value })
                  }
                />
              </Grid>
              <Grid
                item
                xs={4}
                sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}
              >
                <FormLabel title="Đến:" name="name" />
                <Selecter
                  options={toList}
                  renderLabel={(field) => field.name}
                  noOptionsText="Không tìm thấy sản phẩm"
                  renderValue="id"
                  placeholder=""
                  defaultValue={'<0'}
                  onChangeSelect={(value: number | null) =>
                    setDetailAdd({ ...detailAdd, to: value })
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <Button onClick={addProduct} sx={{ height: 1 }}>
                  Thêm
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader title="Thông tin sản phẩm" />
        <FormContent>
          <FormGroup>
            <Grid container spacing={2}>
              {/* <Grid item xs={12}>
                <FormLabel title="Tìm kiếm sản phẩm" name="name" />
                <Selecter
                  options={productList}
                  renderLabel={(field) => field.productName}
                  noOptionsText="Không tìm thấy sản phẩm"
                  placeholder=""
                  onChangeSelect={onChangeSelect}
                  loading={loading}
                />
              </Grid> */}
              <Grid item xs={12} sx={{ minHeight: '200px' }}>
                <TableWrapper sx={{ height: 1 }} component={Paper}>
                  <TableContent total={1} noDataText=" " loading={false}>
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
                                  (filters.pageIndex - 1) * 10,
                                  filters.pageIndex * 10
                                )
                                .map((item, index) => (
                                  <ReceiptEntity
                                    item={item}
                                    key={index}
                                    index={index}
                                    remove={remove}
                                    errors={errors}
                                    register={register}
                                    setValue={setValue}
                                    getValues={getValues}
                                    arrayName="exportWHDetails"
                                    control={control}
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
                    rowsPerPageOptions={[10, 20, 30, 40, 50]}
                  />
                </Grid>
                <Grid item lg={9} xs={0}></Grid>
                <Grid item lg={3} xs={12} p={2}>
                  <TotalBill
                    control={control}
                    setValue={setValue}
                    getValues={getValues}
                  />
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
          <LinkButton to="/hk_care/warehouse/export/cancel">Hủy</LinkButton>

          <LoadingButton type="submit">
            {id ? 'Lưu' : 'Xuất hàng'}
          </LoadingButton>
        </FormFooter>
      </FormPaperGrid>
    </PageWrapperFullwidth>
  );
};

export default CreateForm;
