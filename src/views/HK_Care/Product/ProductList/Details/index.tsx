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
import { useParams } from 'react-router-dom';
import measureService from 'services/measure.service';
import productGroupService from 'services/productGroup.service';
import productListService from 'services/productList.service';
import supplierService from 'services/supplier.service';
import treatmentGroupService from 'services/treatmentGroup.service';
import usageService from 'services/usage.service';
import * as yup from 'yup';

const validationSchema = yup.object().shape({});

const DetailsForm = () => {
  const { id } = useParams();
  const [image, setImage] = useState<Blob | null | string | undefined>();
  const [supplierList, setSupplierList] = useState<ISupplier[]>([]);
  const [treatmentGroupList, setTreatmentGroupList] = useState<
    ITreatmentGroup[]
  >([]);
  const [usageList, setUsageList] = useState<IUsage[]>([]);
  const [productGroupList, setProductGroupList] = useState<IProductGroup[]>([]);
  const [measureList, setMeasureList] = useState<IMeasure[]>([]);
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);

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

    setProductGroupList([productGroupO]);
    setTreatmentGroupList([treamentGroupO]);
    setUsageList([usageO]);
    setMeasureList([mesureLevelFisrt, mesureLevelSecond, mesureLevelThird]);

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
    if (!id) return;

    const { data } = await productListService.get(Number(id));

    if (!data) {
      setLoading(false);
      return;
    }
    setProductDetail(data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (payload: IProduct) => {};

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <PageWrapper title="Chi ti???t s???n ph???m">
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader title="Xem chi ti???t s???n ph???m" />
        <FormContent>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormLabel required title="T??n s???n ph???m" name="name" />
                <ControllerTextField disabled name="name" control={control} />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel
                  required
                  title="Nh??m s???n ph???m"
                  name="productGroupId"
                />
                <EntitySelecter
                  name="productGroupId"
                  control={control}
                  options={productGroupList}
                  renderLabel={(field) => field.name}
                  noOptionsText="Kh??ng t??m th???y nh??m s???n ph???m"
                  placeholder=""
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="S??? ????ng k??" name="numberRegister" />
                <ControllerTextField
                  name="numberRegister"
                  control={control}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel
                  required
                  title="Nh??m ??i???u tr???"
                  name="treamentGroupId"
                />
                <EntitySelecter
                  name="treamentGroupId"
                  control={control}
                  options={treatmentGroupList}
                  renderLabel={(field) => field.name}
                  noOptionsText="Kh??ng t??m th???y nh??m ??i???u tr???"
                  placeholder=""
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="S??? l??" name="lotNumber" />
                <ControllerTextField
                  name="lotNumber"
                  control={control}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel required title="D???ng d??ng" name="usageId" />
                <EntitySelecter
                  name="usageId"
                  control={control}
                  options={usageList}
                  renderLabel={(field) => field.name}
                  noOptionsText="Kh??ng t??m th???y nh??m d???ng d??ng"
                  placeholder=""
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="H???n s??? d???ng" name="outOfDate" />
                <ControllerDatePicker
                  name="outOfDate"
                  control={control}
                  errors={errors}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel required title="????n v???" name="mesureLevelFisrt" />
                <Grid container spacing={2}>
                  <Grid item xs={6} md={2}>
                    <EntitySelecter
                      name="mesureLevelFisrt"
                      control={control}
                      options={measureList}
                      renderLabel={(field) => field.name}
                      noOptionsText="Kh??ng t??m th???y ????n v??? ??o l?????ng"
                      placeholder="C???p 1 *"
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
                      noOptionsText="Kh??ng t??m th???y ????n v??? ??o l?????ng"
                      placeholder="C???p 2"
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
                      noOptionsText="Kh??ng t??m th???y ????n v??? ??o l?????ng"
                      placeholder="C???p 3"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={6} md={2}></Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Nh?? s???n xu???t" name="producer" />
                <ControllerTextField
                  name="producer"
                  disabled
                  control={control}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Ng??y s???n xu???t" name="dateManufacture" />
                <ControllerDatePicker
                  name="dateManufacture"
                  control={control}
                  errors={errors}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Gi?? nh???p" name="importPrice" />

                <ControllerNumberInput
                  name="importPrice"
                  value={getValues('importPrice')}
                  setValue={setValue}
                  disabled
                  control={control}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Gi?? b??n" name="price" />

                <ControllerNumberInput
                  name="price"
                  value={getValues('price')}
                  setValue={setValue}
                  disabled
                  control={control}
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel title="Nh?? cung c???p" name="productsSupplier" />
                <EntityMultipleSelecter
                  name="productsSupplier"
                  control={control}
                  options={supplierList}
                  renderLabel={(field) => field.name}
                  noOptionsText="Kh??ng t??m th???y nh?? cung c???p"
                  placeholder=""
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel title="Quy c??ch ????ng g??i" name="packRule" />
                <ControllerTextField
                  name="packRule"
                  disabled
                  control={control}
                />
              </Grid>

              <Grid item xs={12}>
                <FormLabel title="Ho???t ch???t" name="content" />
                <ControllerTextField
                  name="content"
                  disabled
                  control={control}
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel required title="H??m l?????ng" name="dosage" />
                <ControllerTextField name="dosage" disabled control={control} />
              </Grid>
              <Grid item xs={12}>
                <FormLabel required title="Li???u d??ng" name="routeOfUse" />
                <ControllerTextField
                  name="routeOfUse"
                  disabled
                  control={control}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="H??nh ???nh s???n ph???m" name="productImage" />
                <ControllerImageField
                  image={image}
                  setImage={setImage}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Ghi ch??" name="description" />
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
            Quay l???i danh s??ch s???n ph???m
          </LinkButton>
        </FormFooter>
      </FormPaperGrid>
    </PageWrapper>
  );
};

export default DetailsForm;
