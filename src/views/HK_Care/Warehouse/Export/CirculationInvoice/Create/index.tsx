import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  FormGroup,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import { LinkButton, Scrollbar } from 'components/common';
import PageWrapperFullwidth from 'components/common/PageWrapperFullwidth';
import {
  ControllerTextarea,
  EntitySelecter,
  FormContent,
  FormFooter,
  FormHeader,
  FormLabel,
  FormPaperGrid,
  Selecter,
} from 'components/Form';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableWrapper,
} from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { connectURL } from 'config';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IProductReceiptWHDtos, IReceipt, ITenant } from 'interface';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createImportReceipt,
  getImportReceipt,
  updateImportReceipt,
} from 'redux/slices/importReceipt';
import { getAllProduct } from 'redux/slices/productList';
import { RootState } from 'redux/store';
import importReceiptService from 'services/importReceipt.service';
import tenantService from 'services/tenant.service';
import { FilterParams } from 'types';
import DateFns from 'utils/DateFns';
import * as yup from 'yup';
import ReceiptEntity from './ReceiptEntity';
import TotalBill from './TotalBill';

const validationSchema = yup.object().shape({
  productReceiptWHDtos: yup.array().of(
    yup.object().shape({
      lotNumber: yup.string().required('Bắt buộc'),
    })
  ),
});

const getCells = (): Cells<IReceipt> => [
  { id: 'productId', label: 'STT' },
  { id: 'productName', label: 'Tên sản phẩm' },
  { id: 'mesure', label: 'Đơn vị' },
  { id: 'mesure', label: 'Số lượng' },
  { id: 'mesure', label: 'Giá vốn' },
  { id: 'mesure', label: 'Giá trị xuất' },
  { id: 'importPrice', label: 'Số lô' },
  { id: 'mesure', label: 'Hạn sử dụng' },
  { id: 'mesure', label: '' },
];

const fromList = [
  { id: 1, name: '<0' },
  { id: 2, name: '0' },
  { id: 3, name: '3' },
];
const toList = [
  { id: 1, name: '<0' },
  { id: 2, name: '0' },
  { id: 3, name: '3' },
  { id: 4, name: '6' },
  { id: 5, name: '9' },
  { id: 6, name: '12' },
  { id: 7, name: '36' },
];

const CreateForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const navigate = useNavigate();
  const [productList, setProductList] = useState<IReceipt[]>([]);
  const { loading } = useSelector((state: RootState) => state.productList);
  const [files, setFiles] = useState<File[] | object[]>([]);
  const [pathFile, setPathFile] = useState<string>('');
  const [totalRows, setTotalRows] = useState<number>(0);
  const [tenantList, setTenantList] = useState<ITenant[]>([]);
  const [loadingTenant, setLoadingTenant] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterParams>({
    ...defaultFilters,
    pageSize: 1000,
  });

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
    formState: { errors },
  } = useForm<IReceipt>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const { fields, append, remove } = useFieldArray<IReceipt>({
    control,
    name: 'productReceiptWHDtos',
  });

  const fetchDataUpdate = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getImportReceipt(id));

    if (error) {
      setNotification({ error: 'Lỗi!' });
      return;
    }

    const importReceipt = payload.importReceipt;

    const fileList: object[] = [];
    importReceipt.pathFile &&
      fileList.push({
        name: `${connectURL}/${importReceipt.pathFile}`,
      });

    setFiles(fileList);
    importReceipt.pathFile
      ? setPathFile(`${connectURL}/${importReceipt.pathFile}`)
      : setPathFile('');
    setValue('description', importReceipt.description);
    setValue('vat', importReceipt.vat);

    setValue('discountValue', importReceipt.discountValue);
    setValue('paid', importReceipt.paid);

    setValue('productReceiptWHDtos', importReceipt.listProductReceiptWH);
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
    tenantService
      .getAll()
      .then(({ data }) => {
        setTenantList(data);
        setLoadingTenant(false);
      })
      .catch((e) => {
        setLoadingTenant(false);
      });
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: IReceipt) => {
    // @ts-ignore
    if (data?.productReceiptWHDtos?.length < 1) {
      setNotification({ error: 'Bạn chưa nhập sản phẩm nào' });
      return;
    }
    // @ts-ignore
    data.productReceiptWHDtos.forEach((item) => {
      if (moment(item.expiryDate).isBefore(moment(item.dateManufacture))) {
        setNotification({ error: 'Hạn sử dụng sau ngày sản xuất!' });
        return;
      }

      if (!id) {
        if (moment(item.dateManufacture).isAfter(moment(today))) {
          setNotification({ error: 'Ngày sản xuất trước ngày hôm nay!' });
          return;
        }
        if (moment(yesterday).isAfter(moment(item.expiryDate))) {
          setNotification({ error: 'Hạn sử dụng sau ngày hôm nay!' });
          return;
        }
      }
    });
    const newPayload = {
      ...data,
      vat: data.vat || 0,
      description: data.description || '',
      discountValue: data.discountValue || 0,
      paid: data.paid || 0,
      // @ts-ignore
      productReceiptWHDtos: data.productReceiptWHDtos.map(
        (item: IProductReceiptWHDtos) => {
          return {
            ...item,
            amount: item.amount || 0,
            discount: item.discount || 0,
            importPrice: item.importPrice || 0,
            price: item.price || item.importPrice || 0,
            numberRegister: item.numberRegister || '',
            lotNumber: item.lotNumber || '',
            dateManufacture:
              DateFns.formatDate(item.dateManufacture as Date, 'yyyy-MM-DD') ||
              '',
            expiryDate:
              DateFns.formatDate(item.expiryDate as Date, 'yyyy-MM-DD') || '',
          };
        }
      ),
    };
    if (id) {
      const { error } = await dispatch(
        // @ts-ignore
        updateImportReceipt({ ...newPayload, pathFile, id })
      );
      if (error) {
        setNotification({ error: 'Lỗi!' });
        return;
      }
      setNotification({
        message: 'Cập nhật thành công',
        severity: 'success',
      });
      return;
    }
    const { payload, error } = await dispatch(
      // @ts-ignore
      createImportReceipt({ ...newPayload, pathFile })
    );
    if (error) {
      setNotification({ error: 'Lỗi!' });
      return;
    }
    setNotification({
      message: 'Thêm thành công',
      severity: 'success',
    });
    return navigate(`/hk_care/warehouse/import/receipt`);
  };

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
    }));
  };

  const onChangeSelect = (value: number | null) => {
    const productSelected = productList.filter((x) => x.productId === value)[0];
    append({
      ...productSelected,
      name: productSelected.productName,
      measure: productSelected.mesureNameLevelFirst,
      amount: 0,
    });
  };

  return (
    <PageWrapperFullwidth title={id ? 'Cập nhật hóa đơn' : 'Thêm hóa đơn'}>
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader title=" " />
        <FormContent>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Grid item xs={12} mb={2}>
                  <FormLabel title="Tìm kiếm sản phẩm" name="name" />
                  <Selecter
                    options={productList}
                    renderLabel={(field) => field.productName}
                    noOptionsText="Không tìm thấy sản phẩm"
                    placeholder=""
                    onChangeSelect={onChangeSelect}
                    loading={loading}
                  />
                </Grid>
                <Grid item xs={12} sx={{ minHeight: '200px' }}>
                  <TableWrapper
                    sx={{ height: 1, minHeight: '200px' }}
                    component={Paper}
                  >
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
                              {fields.map((item, index) => (
                                <ReceiptEntity
                                  item={item}
                                  key={index}
                                  index={index}
                                  remove={remove}
                                  errors={errors}
                                  register={register}
                                  setValue={setValue}
                                  getValues={getValues}
                                  arrayName="productReceiptWHDtos"
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
                      totalPages={totalRows}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      rowsPerPage={filters.pageSize}
                      rowsPerPageOptions={[10, 20, 30, 40, 50]}
                    />
                  </Grid>
                  <Grid item xs={12} p={2}>
                    <TotalBill
                      control={control}
                      setValue={setValue}
                      getValues={getValues}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography
                  color="text.secondary"
                  sx={{ mb: 1.5, fontWeight: 'regular', fontSize: '1.74rem' }}
                >
                  Thông tin phiếu chuyển
                </Typography>
                <Grid item xs={12}>
                  <FormLabel title="Điểm bán nhận" name="description" />
                </Grid>
                <Grid item xs={12}>
                  <EntitySelecter
                    name="__tenant"
                    required
                    control={control}
                    options={tenantList}
                    renderLabel={(field) => field.name}
                    placeholder=""
                    noOptionsText="Không tìm thấy điểm bán"
                    loading={loadingTenant}
                  />
                </Grid>
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
            </Grid>
          </FormGroup>
        </FormContent>
        <FormFooter>
          <LinkButton to="/hk_care/warehouse/export/circulation_invoice">
            Hủy
          </LinkButton>

          <LoadingButton type="submit">
            {id ? 'Lưu' : 'Xuất hàng'}
          </LoadingButton>
        </FormFooter>
      </FormPaperGrid>
    </PageWrapperFullwidth>
  );
};

export default CreateForm;
