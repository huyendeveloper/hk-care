import { yupResolver } from '@hookform/resolvers/yup';
import { FormGroup, Grid } from '@mui/material';
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
import { useNotification } from 'hooks';
import {
  IMeasure,
  IProduct,
  IProductGroup,
  ISupplier,
  ITreatmentGroup,
  IUsage,
} from 'interface';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateProduct } from 'redux/slices/product';
import measureService from 'services/measure.service';
import productGroupService from 'services/productGroup.service';
import productListService from 'services/productList.service';
import supplierService from 'services/supplier.service';
import treatmentGroupService from 'services/treatmentGroup.service';
import usageService from 'services/usage.service';
import * as yup from 'yup';

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
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [image, setImage] = useState<Blob | null | string | undefined>();
  const [supplierList, setSupplierList] = useState<ISupplier[]>([]);
  const [treatmentGroupList, setTreatmentGroupList] = useState<
    ITreatmentGroup[]
  >([]);
  const [usageList, setUsageList] = useState<IUsage[]>([]);
  const [productGroupList, setProductGroupList] = useState<IProductGroup[]>([]);
  const [measureList, setMeasureList] = useState<IMeasure[]>([]);
  const [productDetail, setProductDetail] = useState(null);
  const [taskQueue, setTaskQueue] = useState<number>(0);

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
      productImage,
      amountSecond,
      amountThird,
      mesureLevelFisrt,
      mesureLevelSecond,
      mesureLevelThird,
      suppliers,
    } = productDetail;
    productImage && setImage(`${connectURL}/${productImage}`);

    reset({
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
      usageId: usageO.id,
      // @ts-ignore
      productGroupId: productGroupO.id,
      // @ts-ignore
      treamentGroupId: treamentGroupO.id,
      productImage,
      amountSecond,
      amountThird,
      // @ts-ignore
      productsSupplier: suppliers.map((x) => x.id),
      // @ts-ignore
      mesureLevelFisrt: mesureLevelFisrt.id,
      // @ts-ignore
      mesureLevelSecond: mesureLevelSecond.id,
      // @ts-ignore
      mesureLevelThird: mesureLevelThird.id,
    });
  }, [productDetail, reset]);

  const fetchData = async () => {
    setTaskQueue((task) => task + 1);
    if (!crudId) return;

    const { data } = await productListService.get(Number(crudId));

    if (!data) return;
    setProductDetail(data);
    setTaskQueue((task) => task - 1);
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

  const onSubmit = async (payload: IProduct) => {
    const { error } = await dispatch(
      // @ts-ignore
      updateProduct({ ...payload, image })
    );
    if (error) {
      setNotification({ error: 'Lỗi!' });
      return;
    }
    setNotification({
      message: 'Cập nhật thành công',
      severity: 'success',
    });
  };

  if (taskQueue > 0) {
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
                      placeholder="Cấp 1 *"
                      disabled
                      required
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <ControllerTextField
                      type="number"
                      name="amountSecond"
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
                      placeholder="Cấp 2"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <ControllerTextField
                      name="amountThird"
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

                <ControllerNumberInput
                  name="importPrice"
                  value={getValues('importPrice')}
                  setValue={setValue}
                  disabled
                  control={control}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Giá bán" name="price" />

                <ControllerNumberInput
                  name="price"
                  value={getValues('price')}
                  setValue={setValue}
                  disabled
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
          <LinkButton to="/hk_care/product/list">
            Quay lại danh sách sản phẩm
          </LinkButton>
        </FormFooter>
      </FormPaperGrid>
    </PageWrapper>
  );
};

export default DetailsForm;
