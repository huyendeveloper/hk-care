import { yupResolver } from '@hookform/resolvers/yup';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Button,
  FormGroup,
  Grid,
  Tab,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LinkButton, LoadingScreen, PageWrapper } from 'components/common';
import {
  ControllerDatePicker,
  ControllerImageField,
  ControllerTextarea,
  ControllerTextField,
  EntityMultipleSelecter,
  EntitySelecter,
  FormContent,
  FormFooter,
  FormHeader,
  FormLabel,
  FormPaperGrid,
} from 'components/Form';
import { useMounted, useNotification } from 'hooks';
import {
  IMeasure,
  IProduct,
  IProductGroup,
  IProductList,
  ISupplier,
  ITreatmentGroup,
  IUsage,
} from 'interface';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import measureService from 'services/measure.service';
import productService from 'services/product.service';
import productGroupService from 'services/productGroup.service';
import supplierService from 'services/supplier.service';
import treatmentGroupService from 'services/treatmentGroup.service';
import usageService from 'services/usage.service';
import * as yup from 'yup';
import TableData from '../../ProductList/TableData';
// import FormDialog from '../FormDialog';
import Details from './Details';
import LoadingButton from '@mui/lab/LoadingButton';
import { useDispatch } from 'react-redux';
import { updateProduct } from 'redux/slices/product';
import { connectURL } from 'config';
import FormDialog from '../FormDialog';
import productListService from 'services/productList.service';

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Vui lòng nhập tên sản phẩm.')
    .strict(true)
    .default(''),
  description: yup.string().strict(true).default(''),
});

const DetailsForm = () => {
  const { id: crudId } = useParams();
  const mounted = useMounted();
  const [product, setProduct] = useState<IProduct>();
  const [taskQueue, setTaskQueue] = useState<boolean>(true);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const [fileValue, setFileValue] = useState<File | object>();
  const [tab, setTab] = useState<string>('1');
  const [image, setImage] = useState<Blob | null | string | undefined>();
  const [supplierList, setSupplierList] = useState<ISupplier[]>([]);
  const [treatmentGroupList, setTreatmentGroupList] = useState<
    ITreatmentGroup[]
  >([]);
  const [usageList, setUsageList] = useState<IUsage[]>([]);
  const [productGroupList, setProductGroupList] = useState<IProductGroup[]>([]);
  const [measureList, setMeasureList] = useState<IMeasure[]>([]);
  const dispatch = useDispatch();
  const setNotification = useNotification();

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<IProduct>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const fetchData = async () => {
    if (!crudId) return;

    const { data } = await productListService.get(Number(crudId));

    console.log('data', data);
    setValue('name', data?.name);
    setValue('numberRegister', data?.numberRegister);
    setValue('lotNumber', data?.lotNumber);
    setValue('producer', data?.producer);
    setValue('dateManufacture', data?.dateManufacture);
    setValue('outOfDate', data?.outOfDate);
    setValue('importPrice', data?.importPrice);
    setValue('price', data?.price);
    setValue('packRule', data?.packRule);
    setValue('content', data?.content);
    setValue('dosage', data?.dosage);
    setValue('routeOfUse', data?.routeOfUse);
    setValue('description', data?.description);
    setValue('hidden', data?.hidden);
    setValue('usageId', data?.usageO.id);
    setValue('productGroupId', data?.productGroupO.id);
    setValue('treamentGroupId', data?.treamentGroupO.id);
    setValue('productImage', data?.productImage);
    setImage(`${connectURL}/${data?.productImage}`);
    setValue('amountFirst', data?.amountFirst);
    setValue('amountSecond', data?.amountSecond);
    setValue(
      'productsSupplier',
      // @ts-ignore
      data?.suppliers.map((x) => x.id)
    );
    setValue('mesureLevelFisrt', data?.mesureLevelFisrt.id);
    setValue('mesureLevelSecond', data?.mesureLevelSecond.id);
    setValue('mesureLevelThird', data?.mesureLevelThird.id);
    setProduct(data);
    setTaskQueue(false);
  };

  const fetchProductGroupList = () => {
    productGroupService
      .getAllProductGroupp()
      .then(({ data }) => {
        setProductGroupList(data.items);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  const fetchMeasureList = () => {
    measureService
      .getAllMeasure()
      .then(({ data }) => {
        setMeasureList(data.items);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  const fetchTreatmentGroupList = () => {
    treatmentGroupService
      .getAllTreatmentGroup()
      .then(({ data }) => {
        setTreatmentGroupList(data.items);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  const fetchUsageList = () => {
    usageService
      .getAllUsage()
      .then(({ data }) => {
        setUsageList(data.items);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  const fetchSupplierList = () => {
    supplierService
      .getAllSupplier()
      .then(({ data }) => {
        setSupplierList(data.items);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  useEffect(() => {
    fetchData();
    fetchProductGroupList();
    fetchTreatmentGroupList();
    fetchUsageList();
    fetchMeasureList();
    fetchSupplierList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crudId]);

  const getFile = async (image: string) => {
    const { data } = await supplierService.getFile(image);
    setImage(data);
  };

  if (taskQueue) {
    return <LoadingScreen />;
  }

  const handleOpenUpdateDialog = () => {
    setOpenFormDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenFormDialog(false);
    fetchData();
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const onSubmit = async (payload: IProduct) => {
    const { error } = await dispatch(
      // @ts-ignore
      updateProduct({ ...payload, image })
    );
    if (error) {
      setNotification({ error: 'Lỗi khi cập nhật sản phẩm!' });
      return;
    }
    setNotification({
      message: 'Cập nhật thành công',
      severity: 'success',
    });
  };

  return (
    <PageWrapper title="Chi tiết sản phẩm">
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader title="Xem chi tiết sản phẩm" />
        <FormContent>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormLabel required title="Tên sản phẩm" name="name" />
                <ControllerTextField disabled name="name" control={control} />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel
                  required
                  title="Nhóm sản phẩm"
                  name="productGroupId"
                />
                <EntitySelecter
                  name="productGroupId"
                  control={control}
                  options={productGroupList}
                  renderLabel={(field) => field.name}
                  noOptionsText="Không tìm thấy nhóm sản phẩm"
                  defaultValue={getValues('productGroupName')}
                  placeholder=""
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Số đăng ký" name="numberRegister" />
                <ControllerTextField
                  type="number"
                  name="numberRegister"
                  control={control}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel
                  required
                  title="Nhóm điều trị"
                  name="treamentGroupId"
                />
                <EntitySelecter
                  name="treamentGroupId"
                  control={control}
                  options={treatmentGroupList}
                  renderLabel={(field) => field.name}
                  noOptionsText="Không tìm thấy nhóm điều trị"
                  defaultValue={getValues('treamentGroupName')}
                  placeholder=""
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Số lô" name="lotNumber" />
                <ControllerTextField
                  type="number"
                  name="lotNumber"
                  control={control}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel required title="Dạng dùng" name="usageId" />
                <EntitySelecter
                  name="usageId"
                  control={control}
                  options={usageList}
                  renderLabel={(field) => field.name}
                  noOptionsText="Không tìm thấy nhóm dạng dùng"
                  defaultValue={getValues('usageName')}
                  placeholder=""
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Hạn sử dụng" name="outOfDate" />
                <ControllerDatePicker
                  name="outOfDate"
                  control={control}
                  errors={errors}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel required title="Đơn vị" name="mesureLevelFisrt" />
                <Grid container spacing={2}>
                  <Grid item xs={6} md={2}>
                    <EntitySelecter
                      name="mesureLevelFisrt"
                      control={control}
                      options={measureList}
                      renderLabel={(field) => field.name}
                      noOptionsText="Không tìm thấy đơn vị đo lường"
                      defaultValue={getValues('mesureLevelFisrtName')}
                      placeholder="Cấp 1 *"
                      disabled
                      required
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <ControllerTextField
                      type="number"
                      name="amountFirst"
                      control={control}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <EntitySelecter
                      name="mesureLevelSecond"
                      control={control}
                      options={measureList}
                      renderLabel={(field) => field.name}
                      noOptionsText="Không tìm thấy đơn vị đo lường"
                      defaultValue={getValues('mesureLevelSecondName')}
                      placeholder="Cấp 2"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <ControllerTextField
                      name="amountSecond"
                      control={control}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <EntitySelecter
                      name="mesureLevelThird"
                      control={control}
                      options={measureList}
                      renderLabel={(field) => field.name}
                      noOptionsText="Không tìm thấy đơn vị đo lường"
                      defaultValue={getValues('mesureLevelThirdName')}
                      placeholder="Cấp 3"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={6} md={2}></Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Nhà sản xuất" name="producer" />
                <ControllerTextField
                  name="producer"
                  disabled
                  control={control}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Ngày sản xuất" name="dateManufacture" />
                <ControllerDatePicker
                  name="dateManufacture"
                  control={control}
                  errors={errors}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Giá nhập" name="importPrice" />
                <ControllerTextField
                  name="importPrice"
                  disabled
                  control={control}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Giá bán" name="price" />
                <ControllerTextField name="price" disabled control={control} />
              </Grid>
              <Grid item xs={12}>
                <FormLabel title="Nhà cung cấp" name="productsSupplier" />
                <EntityMultipleSelecter
                  name="productsSupplier"
                  control={control}
                  options={supplierList}
                  renderLabel={(field) => field.name}
                  noOptionsText="Không tìm thấy nhà cung cấp"
                  placeholder=""
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel title="Quy cách đóng gói" name="packRule" />
                <ControllerTextField
                  name="packRule"
                  disabled
                  control={control}
                />
              </Grid>

              <Grid item xs={12}>
                <FormLabel title="Hoạt chất" name="content" />
                <ControllerTextField
                  name="content"
                  disabled
                  control={control}
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel required title="Hàm lượng" name="dosage" />
                <ControllerTextField name="dosage" disabled control={control} />
              </Grid>
              <Grid item xs={12}>
                <FormLabel required title="Liều dùng" name="routeOfUse" />
                <ControllerTextField
                  name="routeOfUse"
                  disabled
                  control={control}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Hình ảnh sản phẩm" name="productImage" />
                <ControllerImageField
                  image={image}
                  setImage={setImage}
                  disabled
                />
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
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>

        <FormFooter>
          <LinkButton to="/hk_group/product/list">
            Quay lại danh sách sản phẩm
          </LinkButton>

          <Button variant="contained" onClick={handleOpenUpdateDialog}>
            Chỉnh sửa thông tin sản phẩm
          </Button>
        </FormFooter>
      </FormPaperGrid>

      <FormDialog
        dataUpdate={product}
        // @ts-ignore
        currentID={Number(crudId)}
        open={openFormDialog}
        handleClose={handleCloseUpdateDialog}
      />
    </PageWrapper>
  );
};

export default DetailsForm;
