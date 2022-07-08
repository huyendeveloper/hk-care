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
import ChooseOption from 'components/Form/ChooseOption';
import { TableContent, TableHeader, TableWrapper } from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { connectURL } from 'config';
import { defaultFilters } from 'constants/defaultFilters';
import { yupDate } from 'constants/typeInput';
import { useNotification } from 'hooks';
import { IProductReceiptWHDtos, IReceipt } from 'interface';
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
import { FilterParams } from 'types';
import DateFns from 'utils/DateFns';
import * as yup from 'yup';
import ReceiptEntity from './ReceiptEntity';
import TotalBill from './TotalBill';

const validationSchema = yup.object().shape({
  productReceiptWHDtos: yup.array().of(
    yup.object().shape({
      lotNumber: yup.string().default(''),
      numberRegister: yup.string().default(''),
      dateManufacture: yup
        .date()
        .notRequired()
        .nullable(true)
        .typeError('Sai định dạng')
        .test('validateDateManufacture', 'Trước hạn sử dụng!', function (item) {
          const dateManufacture = item;
          const { expiryDate } = this.parent;
          if (!dateManufacture || !expiryDate) {
            return true;
          }
          if (moment(dateManufacture).isAfter(moment(expiryDate))) {
            return false;
          }
          return true;
        })
        .default(null),
      expiryDate: yup
        .date()
        .notRequired()
        .nullable(true)
        .typeError('Sai định dạng')
        .test('validateExpiryDate', 'Sau ngày sản xuất!', function (item) {
          const { dateManufacture } = this.parent;
          const expiryDate = item;
          if (!dateManufacture || !expiryDate) {
            return true;
          }
          if (moment(dateManufacture).isAfter(moment(expiryDate))) {
            return false;
          }
          return true;
        }),
    })
  ),
  vat: yup.number().typeError('Vui lòng nhập!').default(0),
  discountValue: yup.number().typeError('Vui lòng nhập!').default(0),
  paid: yup.number().typeError('Vui lòng nhập!').default(0),
});

const getCells = (): Cells<IReceipt> => [
  { id: 'productId', label: 'STT' },
  { id: 'productName', label: 'Tên SP' },
  { id: 'mesure', label: 'Đ.Vị' },
  { id: 'mesure', label: 'SL' },
  { id: 'mesure', label: 'Giá nhập' },
  { id: 'mesure', label: 'Giá bán' },
  { id: 'productGroup', label: 'C.Khấu' },
  { id: 'stockQuantity', label: 'T.T' },
  { id: 'importPrice', label: 'Số lô' },
  { id: 'price', label: 'Số ĐK' },
  { id: 'price', label: 'NSX' },
  { id: 'mesure', label: 'HSD' },
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
  const [productChoosed, setProductChoosed] = useState<number | null>(null);
  const [filters, setFilters] = useState<FilterParams>({
    ...defaultFilters,
    pageSize: 1000,
  });

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
      if (
        // @ts-ignore
        files[0].type &&
        // @ts-ignore
        (files[0].type === 'application/pdf' ||
          // @ts-ignore
          files[0].type.substr(0, 5) === 'image')
      ) {
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
  } = useForm<IReceipt>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    // @ts-ignore
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

    const {
      pathFile,
      description,
      vat,
      discountValue,
      paid,
      listProductReceiptWH,
    } = payload.importReceipt;

    const fileList: object[] = [];
    pathFile &&
      fileList.push({
        name: `${connectURL}/${pathFile}`,
      });

    setFiles(fileList);
    pathFile ? setPathFile(`${connectURL}/${pathFile}`) : setPathFile('');

    reset({
      description,
      vat,
      discountValue,
      paid,
      productReceiptWHDtos: listProductReceiptWH,
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
      const { error, payload } = await dispatch(
        // @ts-ignore
        updateImportReceipt({ ...newPayload, pathFile, id })
      );
      if (error) {
        setNotification({ error: payload.response.data.join(',') || 'Lỗi!' });
        return;
      }
      setNotification({
        message: 'Cập nhật thành công',
        severity: 'success',
      });
      return navigate(`/hk_care/warehouse/import/receipt`);
    }
    const { error, payload } = await dispatch(
      // @ts-ignore
      createImportReceipt({ ...newPayload, pathFile })
    );
    if (error) {
      setNotification({ error: payload.response.data.join(' ') || 'Lỗi!' });
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
    setProductChoosed(value);
    const productSelected = productList.filter((x) => x.productId === value)[0];
    // @ts-ignore
    append({
      ...productSelected,
      name: productSelected.productName,
      measure: productSelected.mesureNameLevelFirst,
      amount: 0,
      discount: 0,
      expiryDate: productSelected.outOfDate,
    });
    setProductChoosed(null);
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
                <ChooseOption
                  options={productList}
                  renderLabel={(field) => field.productName}
                  noOptionsText="Không tìm thấy sản phẩm"
                  renderValue="productId"
                  placeholder=""
                  onChangeSelect={onChangeSelect}
                  loading={loading}
                  value={productChoosed}
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
                <Grid item lg={8} xs={0}></Grid>
                <Grid item lg={4} xs={12} p={2}>
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
                    accept="image/*,application/pdf"
                    message="Tài liệu đính kèm chỉ cho phép file pdf và ảnh."
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
