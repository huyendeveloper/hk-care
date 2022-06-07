import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, FormGroup, Grid } from '@mui/material';
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
import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import { connectURL } from 'config';
import { yupDate, yupOnlyNumber } from 'constants/typeInput';
import { useNotification } from 'hooks';
import {
  IMeasure,
  IProduct,
  IProductGroup,
  ISupplier,
  ITreatmentGroup,
  IUsage,
} from 'interface';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateProduct } from 'redux/slices/product';
import measureService from 'services/measure.service';
import productService from 'services/product.service';
import productGroupService from 'services/productGroup.service';
import supplierService from 'services/supplier.service';
import treatmentGroupService from 'services/treatmentGroup.service';
import usageService from 'services/usage.service';
import * as yup from 'yup';
import FormDialog from '../FormDialog';

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Vui lòng nhập tên sản phẩm.')
    .trim('Vui lòng nhập tên sản phẩm.'),
  productGroupId: yupOnlyNumber('Vui lòng chọn nhóm sản phẩm.'),
  treamentGroupId: yupOnlyNumber('Vui lòng chọn nhóm điều trị.'),
  usageId: yupOnlyNumber('Vui lòng chọn dạng dùng.'),
  mesureLevelFisrt: yupOnlyNumber('Vui lòng chọn đơn vị cấp 1.'),
  outOfDate: yupDate,
  dosage: yup
    .string()
    .required('Vui lòng nhập hàm lượng.')
    .trim('Vui lòng nhập hàm lượng.')
    .default('Null'),
  routeOfUse: yup
    .string()
    .required('Vui lòng nhập liều dùng.')
    .trim('Vui lòng nhập liều dùng.')
    .default('Theo chỉ định'),
  dateManufacture: yupDate,
});

const DetailsForm = () => {
  const { id: crudId } = useParams();
  const [product, setProduct] = useState<IProduct>();
  const [taskQueue, setTaskQueue] = useState<boolean>(true);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const [image, setImage] = useState<Blob | null | string | undefined>();
  const [supplierList, setSupplierList] = useState<ISupplier[]>([]);
  const [treatmentGroupList, setTreatmentGroupList] = useState<
    ITreatmentGroup[]
  >([]);
  const [usageList, setUsageList] = useState<IUsage[]>([]);
  const [productGroupList, setProductGroupList] = useState<IProductGroup[]>([]);
  const [measureList, setMeasureList] = useState<IMeasure[]>([]);
  const [disabled, setDisabled] = useState<boolean>(true);
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

    const { data } = await productService.get(Number(crudId));

    setValue('id', data?.id);
    setValue('name', data?.name);
    data?.numberRegister && setValue('numberRegister', data?.numberRegister);
    data?.lotNumber && setValue('lotNumber', data?.lotNumber);
    setValue('producer', data?.producer);
    data?.dateManufacture && setValue('dateManufacture', data?.dateManufacture);
    data?.outOfDate && setValue('outOfDate', data?.outOfDate);
    setValue('importPrice', data?.importPrice);
    setValue('price', data?.price);
    setValue('packRule', data?.packRule);
    setValue('content', data?.content);
    setValue('dosage', data?.dosage);
    setValue('routeOfUse', data?.routeOfUse);
    setValue('description', data?.description);
    setValue('hidden', data?.hidden);
    setValue('usageId', data?.usageO.id);
    setValue('usageName', data?.usageO.name);
    setValue('productGroupId', data?.productGroupO.id);
    setValue('productGroupName', data?.productGroupO.name);
    setValue('treamentGroupId', data?.treamentGroupO.id);
    setValue('treamentGroupName', data?.treamentGroupO.name);
    setValue('productImage', data?.productImage);
    data?.productImage && setImage(`${connectURL}/${data?.productImage}`);
    setValue('amountSecond', data?.amountSecond);
    data?.amountThird && setValue('amountThird', data?.amountThird);
    // setSupplierList(data?.suppliers);
    setValue(
      'productsSupplier',
      // @ts-ignore
      data?.suppliers.map((x) => x.id)
    );
    setValue('mesureLevelFisrt', data?.mesureLevelFisrt.id);
    setValue('mesureLevelFisrtName', data?.mesureLevelFisrt.name);
    setValue('mesureLevelSecond', data?.mesureLevelSecond.id);
    setValue('mesureLevelSecondName', data?.mesureLevelSecond.name);
    setValue('mesureLevelThird', data?.mesureLevelThird.id);
    setValue('mesureLevelThirdName', data?.mesureLevelThird.name);
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
        setSupplierList(data);
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

  if (taskQueue) {
    return <LoadingScreen />;
  }

  const handleCloseUpdateDialog = () => {
    setOpenFormDialog(false);
    fetchData();
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

    setDisabled(true);
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
                <ControllerTextField
                  disabled={disabled}
                  name="name"
                  control={control}
                />
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
                  disabled={disabled}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Số đăng ký" name="numberRegister" />
                <ControllerTextField
                  type="number"
                  name="numberRegister"
                  control={control}
                  disabled={disabled}
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
                  disabled={disabled}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Số lô" name="lotNumber" />
                <ControllerTextField
                  type="number"
                  name="lotNumber"
                  control={control}
                  disabled={disabled}
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
                  disabled={disabled}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Hạn sử dụng" name="outOfDate" />
                <ControllerDatePicker
                  name="outOfDate"
                  control={control}
                  errors={errors}
                  disabled={disabled}
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
                      disabled={disabled}
                      required
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <ControllerTextField
                      type="number"
                      name="amountSecond"
                      control={control}
                      disabled={disabled}
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
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <ControllerTextField
                      type={'number'}
                      name="amountThird"
                      control={control}
                      disabled={disabled}
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
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}></Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Nhà sản xuất" name="producer" />
                <ControllerTextField
                  name="producer"
                  disabled={disabled}
                  control={control}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Ngày sản xuất" name="dateManufacture" />
                <ControllerDatePicker
                  name="dateManufacture"
                  control={control}
                  errors={errors}
                  disabled={disabled}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Giá nhập" name="importPrice" />
                <ControllerNumberInput
                  name="importPrice"
                  value={product?.importPrice}
                  setValue={setValue}
                  disabled={disabled}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Giá bán" name="price" />
                <ControllerNumberInput
                  name="price"
                  value={product?.price}
                  setValue={setValue}
                  disabled={disabled}
                />
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
                  disabled={disabled}
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel title="Quy cách đóng gói" name="packRule" />
                <ControllerTextField
                  name="packRule"
                  disabled={disabled}
                  control={control}
                />
              </Grid>

              <Grid item xs={12}>
                <FormLabel title="Hoạt chất" name="content" />
                <ControllerTextField
                  name="content"
                  disabled={disabled}
                  control={control}
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel required title="Hàm lượng" name="dosage" />
                <ControllerTextField
                  name="dosage"
                  disabled={disabled}
                  control={control}
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel required title="Liều dùng" name="routeOfUse" />
                <ControllerTextField
                  name="routeOfUse"
                  disabled={disabled}
                  control={control}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Hình ảnh sản phẩm" name="productImage" />
                <ControllerImageField
                  image={image}
                  setImage={setImage}
                  disabled={disabled}
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
                    disabled={disabled}
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

          {!disabled && <LoadingButton type="submit">Lưu</LoadingButton>}

          {disabled && (
            <Button variant="contained" onClick={() => setDisabled(false)}>
              Chỉnh sửa thông tin sản phẩm
            </Button>
          )}
        </FormFooter>
      </FormPaperGrid>

      <FormDialog
        dataUpdate={product}
        // @ts-ignore
        currentID={product?.id}
        open={openFormDialog}
        handleClose={handleCloseUpdateDialog}
      />
    </PageWrapper>
  );
};

export default DetailsForm;
