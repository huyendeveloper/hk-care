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
  FormPaperGrid
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
  IUsage
} from 'interface';
import { useEffect, useState } from 'react';
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

yup.addMethod(yup.string, 'trimCustom', function (errorMessage) {
  return this.test(`test-trim`, errorMessage, function (value) {
    const { path, createError } = this;

    return (
      (value && value.trim() !== '') ||
      createError({ path, message: errorMessage })
    );
  });
});

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Vui lòng nhập tên sản phẩm.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập tên sản phẩm.'),
  productGroupId: yupOnlyNumber('Vui lòng chọn nhóm sản phẩm.'),
  treamentGroupId: yupOnlyNumber('Vui lòng chọn nhóm điều trị.'),
  usageId: yupOnlyNumber('Vui lòng chọn dạng dùng.'),
  mesureLevelFisrt: yupOnlyNumber('Vui lòng chọn đơn vị cấp 1.'),
  outOfDate: yupDate,
  dosage: yup
    .string()
    .required('Vui lòng nhập hàm lượng.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập hàm lượng.')
    .default('Null'),
  routeOfUse: yup
    .string()
    .required('Vui lòng nhập liều dùng.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập liều dùng.')
    .default('Theo chỉ định'),
  dateManufacture: yupDate,
});

const DetailsForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [productDetail, setProductDetail] = useState(null);
  const [image, setImage] = useState<Blob | null | string | undefined>();
  const [supplierList, setSupplierList] = useState<ISupplier[]>([]);
  const [treatmentGroupList, setTreatmentGroupList] = useState<
    ITreatmentGroup[]
  >([]);
  const [usageList, setUsageList] = useState<IUsage[]>([]);
  const [productGroupList, setProductGroupList] = useState<IProductGroup[]>([]);
  const [measureList, setMeasureList] = useState<IMeasure[]>([]);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IProduct>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  useEffect(() => {
    if (!productDetail) return;

    const {
      id,
      name,
      numberRegister,
      lotNumber,
      producer,
      dateManufacture,
      outOfDate,
      importPrice,
      price,
      packRule,
      content,
      dosage,
      routeOfUse,
      description,
      hidden,
      usageO,
      productGroupO,
      treamentGroupO,
      amountSecond,
      amountThird,
      mesureLevelFisrt,
      mesureLevelSecond,
      mesureLevelThird,
      suppliers,
      productImage,
    } = productDetail;

    reset({
      id,
      name,
      numberRegister,
      lotNumber,
      producer,
      dateManufacture,
      outOfDate,
      importPrice,
      price,
      packRule,
      content,
      dosage,
      routeOfUse,
      description,
      hidden,
      // @ts-ignore
      usageId: usageO.id || null,
      // @ts-ignore
      productGroupId: productGroupO.id || null,
      // @ts-ignore
      treamentGroupId: treamentGroupO.id || null,
      productImage,
      amountSecond,
      amountThird,
      // @ts-ignore
      mesureLevelFisrt: mesureLevelFisrt.id || null,
      // @ts-ignore
      mesureLevelSecond: mesureLevelSecond.id || null,
      // @ts-ignore
      mesureLevelThird: mesureLevelThird.id || null,
      // @ts-ignore
      productsSupplier: suppliers.map((x) => x.id),
    });
    productImage && setImage(`${connectURL}/${productImage}`);
  }, [productDetail, reset]);

  const fetchData = async () => {
    setLoading(true);
    if (!id) return;

    const { data } = await productService.get(Number(id));
    if (!data) {
      setLoading(false);
      return;
    }
    setProductDetail(data);
    setLoading(false);
  };

  const fetchProductGroupList = () => {
    productGroupService
      .getAllProductGroup()
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
  }, [id]);

  const onSubmit = async (payload: IProduct) => {
    setShowBackdrop(true);
    const { error } = await dispatch(
      // @ts-ignore
      updateProduct({ ...payload, image })
    );
    if (error) {
      setNotification({ error: 'Lỗi!' });
      setShowBackdrop(false);
      return;
    }
    setNotification({
      message: 'Cập nhật thành công',
      severity: 'success',
    });

    setDisabled(true);
    setShowBackdrop(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

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
                  // @ts-ignore
                  defaultValue={productDetail?.importPrice}
                  setValue={setValue}
                  disabled={disabled}
                  control={control}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Giá bán" name="price" />
                <ControllerNumberInput
                  name="price"
                  // @ts-ignore
                  defaultValue={productDetail?.price}
                  setValue={setValue}
                  disabled={disabled}
                  control={control}
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

          {!disabled && (
            <LoadingButton loading={showBackdrop} type="submit">
              Lưu
            </LoadingButton>
          )}

          {disabled && (
            <Button variant="contained" onClick={() => setDisabled(false)}>
              Chỉnh sửa thông tin sản phẩm
            </Button>
          )}
        </FormFooter>
      </FormPaperGrid>
    </PageWrapper>
  );
};

export default DetailsForm;
