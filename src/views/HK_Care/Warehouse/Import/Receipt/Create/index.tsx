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
import { TableContent, TableHeader, TableWrapper } from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { connectURL } from 'config';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IReceipt } from 'interface';
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
import { FilterParams } from 'types';
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
  { id: 'mesure', label: 'Giá nhập' },
  { id: 'mesure', label: 'Giá bán' },
  { id: 'productGroup', label: 'Chiết khấu' },
  { id: 'stockQuantity', label: 'Thành tiền' },
  { id: 'importPrice', label: 'Số lô' },
  { id: 'price', label: 'Số đăng ký' },
  { id: 'price', label: 'Ngày sản xuất' },
  { id: 'mesure', label: 'Hạn dùng' },
  { id: 'mesure', label: '' },
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
  const [filters, setFilters] = useState<FilterParams>({
    ...defaultFilters,
    pageSize: 1000,
  });

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
      setNotification({
        error: 'Lỗi khi tải danh sách sản phẩm!',
      });
      return;
    }

    const importReceipt = payload.importReceipt;

    const fileList: object[] = [];
    importReceipt.pathFile &&
      fileList.push({
        name: `${connectURL}/${importReceipt.pathFile}`,
      });

    setFiles(fileList);
    setPathFile(`${connectURL}/${importReceipt.pathFile}`);
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
      setNotification({
        error: 'Lỗi khi tải danh sách sản phẩm!',
      });
      return;
    }
    setProductList(payload.productList);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: IReceipt) => {
    // @ts-ignore
    if (data?.productReceiptWHDtos?.length < 1) {
      setNotification({ error: 'Bạn chưa nhập sản phẩm nào' });
      return;
    }
    const newPayload = {
      ...data,
      vat: data.vat || 0,
      description: data.description || '',
      discountValue: data.discountValue || 0,
      paid: data.paid || 0,
      // @ts-ignore
      productReceiptWHDtos: data.productReceiptWHDtos.map((item) => ({
        ...item,
        amount: data.amount || 0,
        discount: data.discount || 0,
        importPrice: data.importPrice || 0,
        price: data.price || data.importPrice || 0,
        numberRegister: data.numberRegister || '',
        lotNumber: data.lotNumber || '',
      })),
    };
    if (id) {
      const { error } = await dispatch(
        // @ts-ignore
        updateImportReceipt({ ...newPayload, pathFile, id })
      );
      if (error) {
        setNotification({ error: 'Lỗi khi cập nhật hóa đơn nhập kho!' });
        return;
      }
      setNotification({
        message: 'Cập nhật thành công',
        severity: 'success',
      });
      return;
    }
    const { payload, error, ...res } = await dispatch(
      // @ts-ignore
      createImportReceipt({ ...newPayload, pathFile })
    );
    if (error) {
      setNotification({ error: 'Lỗi khi thêm hóa đơn nhập kho!' });
      return;
    }
    setNotification({
      message: 'Thêm thành công',
      severity: 'success',
    });
    return navigate(`/hk_care/warehouse/import/receipt/${payload.id}`);
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
        <FormHeader title="Thông tin sản phẩm" />
        <FormContent>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Tài liệu đính kèm" name="description" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerMultiFile
                    files={files}
                    setFiles={setFiles}
                    max={1}
                  />
                </Grid>
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>
        <FormFooter>
          <LinkButton to="/hk_care/warehouse/import/receipt">Hủy</LinkButton>

          <LoadingButton type="submit">{id ? 'Lưu' : 'Nhập kho'}</LoadingButton>
        </FormFooter>
      </FormPaperGrid>
    </PageWrapperFullwidth>
  );
};

export default CreateForm;
