import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Dialog, Grid, IconButton, Stack } from '@mui/material';
import { getValue } from '@testing-library/user-event/dist/utils';
import { LoadingScreen } from 'components/common';
import {
  ControllerDatePicker,
  ControllerImageField,
  ControllerTextarea,
  ControllerTextField,
  EntityMultipleSelecter,
  FormContent,
  FormFooter,
  FormGroup,
  FormHeader,
  FormLabel,
  FormPaperGrid,
} from 'components/Form';
import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import EntitySelecter from 'components/Form/EntitySelecter';
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
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { createProduct, updateProduct } from 'redux/slices/product';
import measureService from 'services/measure.service';
import productService from 'services/product.service';
import productGroupService from 'services/productGroup.service';
import supplierService from 'services/supplier.service';
import treatmentGroupService from 'services/treatmentGroup.service';
import usageService from 'services/usage.service';
import FormDialogSupplier from 'views/HK_Group/Product/Supplier/FormDialog';
import * as yup from 'yup';

interface Props {
  open: boolean;
  handleClose: (updated?: boolean) => void;
  currentID?: number | null;
  dataUpdate?: IProduct;
  supplierId?: number;
  fetchData: () => void;
}

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
    .required('Vui l??ng nh???p t??n s???n ph???m.')
    // @ts-ignore
    .trimCustom('Vui l??ng nh???p t??n s???n ph???m.'),
  productGroupId: yup
    .number()
    .required('Vui l??ng ch???n nh??m s???n ph???m.')
    .typeError('Vui l??ng ch???n nh??m s???n ph???m.')
    .integer('Vui l??ng ch???n nh??m s???n ph???m.')
    .min(0, 'Vui l??ng ch???n nh??m s???n ph???m.'),
  treamentGroupId: yup
    .number()
    .required('Vui l??ng ch???n nh??m ??i???u tr???.')
    .typeError('Vui l??ng ch???n nh??m ??i???u tr???.')
    .integer('Vui l??ng ch???n nh??m ??i???u tr???.')
    .min(0, 'Vui l??ng ch???n nh??m ??i???u tr???.'),
  usageId: yup
    .number()
    .required('Vui l??ng ch???n d???ng d??ng.')
    .typeError('Vui l??ng ch???n d???ng d??ng.')
    .integer('Vui l??ng ch???n d???ng d??ng.')
    .min(0, 'Vui l??ng ch???n d???ng d??ng.'),
  mesureLevelFisrt: yup
    .number()
    .required('Vui l??ng ch???n ????n v??? c???p 1.')
    .typeError('Vui l??ng ch???n ????n v??? c???p 1.')
    .integer('Vui l??ng ch???n ????n v??? c???p 1.')
    .min(0, 'Vui l??ng ch???n ????n v??? c???p 1.'),
  outOfDate: yupDate,
  dosage: yup
    .string()
    .required('Vui l??ng nh???p h??m l?????ng.')
    // @ts-ignore
    .trimCustom('Vui l??ng nh???p h??m l?????ng.')
    .default('Null'),
  routeOfUse: yup
    .string()
    .required('Vui l??ng nh???p li???u d??ng.')
    // @ts-ignore
    .trimCustom('Vui l??ng nh???p li???u d??ng.')
    .default('Theo ch??? ?????nh'),
  dateManufacture: yupDate,
});

const FormDialog = ({
  open,
  handleClose,
  currentID,
  supplierId,
  fetchData,
}: Props) => {
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [image, setImage] = useState<Blob | null | string | undefined>();
  const [productGroupList, setProductGroupList] = useState<IProductGroup[]>([]);
  const [measureList, setMeasureList] = useState<IMeasure[]>([]);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const [supplierList, setSupplierList] = useState<ISupplier[]>([]);
  const [treatmentGroupList, setTreatmentGroupList] = useState<
    ITreatmentGroup[]
  >([]);
  const [usageList, setUsageList] = useState<IUsage[]>([]);
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [productsSupplier, setProductsSupplier] = useState<number[]>([]);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
  } = useForm<IProduct>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const fetchDataUpdate = async () => {
    if (currentID) {
      setLoading(true);
      const { data } = await productService.get(currentID);
      if (!data) {
        setLoading(false);
        return;
      }
      setProductDetail(data);
      setLoading(false);
    } else {
      if (supplierId) {
        setProductsSupplier([supplierId]);
      }

      setImage(null);
    }
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
    fetchProductGroupList();
    fetchTreatmentGroupList();
    fetchUsageList();
    fetchMeasureList();
    fetchSupplierList();
  }, []);

  useEffect(() => {
    setProductDetail(null);
    reset({
      dosage: 'Null',
      routeOfUse: 'Theo ch??? ?????nh',
      outOfDate: null,
      dateManufacture: null,
      price: 0,
      importPrice: 0,
    });
    setImage(undefined);
    fetchDataUpdate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentID, open]);

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

  const handleCloseFormDialog = (updated: boolean | undefined) => {
    fetchSupplierList();
    setProductsSupplier([]);
    setOpenFormDialog(false);
  };

  const onSubmit = async (body: IProduct) => {
    setShowBackdrop(true);
    if (body.id) {
      const { payload, error } = await dispatch(
        // @ts-ignore
        updateProduct({ ...body, image })
      );
      if (error) {
        setNotification({
          error: payload.response.data || 'H??? th???ng ??ang g???p s??? c???',
        });
        setShowBackdrop(false);
        return;
      }
      setNotification({
        message: 'C???p nh???t th??nh c??ng',
        severity: 'success',
      });
    } else {
      const suppliers = productsSupplier.length > 0 ? { productsSupplier } : {};
      const { payload, error } = await dispatch(
        // @ts-ignore
        createProduct({ ...body, image, ...suppliers })
      );
      if (error) {
        setNotification({
          error: payload.response.data || 'H??? th???ng ??ang g???p s??? c???',
        });
        setShowBackdrop(false);
        return;
      }
      setNotification({ message: 'Th??m th??nh c??ng', severity: 'success' });
    }
    setShowBackdrop(false);
    fetchData();
    reset({ price: 0, importPrice: 0 });
    handleClose(true);
  };

  const importPrice = useWatch({
    control,
    name: 'importPrice',
  });

  const price = useWatch({
    control,
    name: 'price',
  });

  useEffect(() => {
    console.log('price', price);
    console.log('importPrice', importPrice);
    if (importPrice > price) {
      setValue('price', importPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importPrice]);

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={() => handleClose()}>
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader
          title={
            currentID ? 'Ch???nh s???a th??ng tin s???n ph???m' : 'Th??m m???i s???n ph???m'
          }
        />
        <FormContent>
          <FormGroup>
            {loading ? (
              <Stack justifyContent="center" sx={{ minHeight: '50vh' }}>
                <LoadingScreen />
              </Stack>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <FormLabel required title="T??n s???n ph???m" name="name" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField name="name" control={control} />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel
                      required
                      title="Nh??m s???n ph???m"
                      name="productGroupId"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <EntitySelecter
                      name="productGroupId"
                      control={control}
                      options={productGroupList}
                      renderLabel={(field) => field.name}
                      noOptionsText="Kh??ng t??m th???y nh??m s???n ph???m"
                      placeholder=""
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="S??? ????ng k??" name="numberRegister" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField
                      name="numberRegister"
                      control={control}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel
                      required
                      title="Nh??m ??i???u tr???"
                      name="treamentGroupId"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <EntitySelecter
                      name="treamentGroupId"
                      control={control}
                      options={treatmentGroupList}
                      renderLabel={(field) => field.name}
                      noOptionsText="Kh??ng t??m th???y nh??m ??i???u tr???"
                      placeholder=""
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="S??? l??" name="lotNumber" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField name="lotNumber" control={control} />
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel required title="D???ng d??ng" name="usageId" />
                  </Grid>
                  <Grid item xs={12}>
                    <EntitySelecter
                      name="usageId"
                      control={control}
                      options={usageList}
                      renderLabel={(field) => field.name}
                      noOptionsText="Kh??ng t??m th???y nh??m d???ng d??ng"
                      placeholder=""
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="H???n s??? d???ng" name="outOfDate" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerDatePicker
                      name="outOfDate"
                      control={control}
                      errors={errors}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <FormLabel
                      required
                      title="????n v???"
                      name="mesureLevelFisrt"
                    />
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={2}>
                      <EntitySelecter
                        name="mesureLevelFisrt"
                        control={control}
                        options={measureList}
                        renderLabel={(field) => field.name}
                        noOptionsText="Kh??ng t??m th???y ????n v??? ??o l?????ng"
                        placeholder="C???p 1 *"
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <ControllerTextField
                        type="number"
                        name="amountSecond"
                        control={control}
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
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <ControllerTextField
                        type={'number'}
                        name="amountThird"
                        control={control}
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
                      />
                    </Grid>
                    <Grid item xs={6} md={2}></Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="Nh?? s???n xu???t" name="producer" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField name="producer" control={control} />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="Ng??y s???n xu???t" name="dateManufacture" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerDatePicker
                      name="dateManufacture"
                      control={control}
                      errors={errors}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="Gi?? nh???p" name="importPrice" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerNumberInput
                      name="importPrice"
                      // @ts-ignore
                      setValue={setValue}
                      value={getValues('importPrice')}
                      control={control}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="Gi?? b??n" name="price" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerNumberInput
                      name="price"
                      // @ts-ignore
                      setValue={setValue}
                      control={control}
                      value={getValues('price')}
                      errors={
                        importPrice > price ? 'Gi?? b??n kh??ng h???p l???!' : ''
                      }
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <FormLabel title="Nh?? cung c???p" name="productsSupplier" />
                  </Grid>
                  <Stack flexDirection={'row'}>
                    <Box sx={{ width: '100%' }}>
                      <EntityMultipleSelecter
                        name="productsSupplier"
                        control={control}
                        options={supplierList}
                        renderLabel={(field) => field.name}
                        noOptionsText="Kh??ng t??m th???y nh?? cung c???p"
                        placeholder=""
                        disabled={productsSupplier.length > 0}
                      />
                    </Box>
                    <IconButton
                      sx={{ ml: 1 }}
                      onClick={() => setOpenFormDialog(true)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <FormLabel title="Quy c??ch ????ng g??i" name="packRule" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField name="packRule" control={control} />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <FormLabel title="Ho???t ch???t" name="content" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField name="content" control={control} />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <FormLabel required title="H??m l?????ng" name="dosage" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField name="dosage" control={control} />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <FormLabel required title="Li???u d??ng" name="routeOfUse" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField name="routeOfUse" control={control} />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="H??nh ???nh s???n ph???m" name="productImage" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerImageField image={image} setImage={setImage} />
                  </Grid>
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
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
          </FormGroup>
        </FormContent>

        <FormFooter>
          <Button
            variant="outlined"
            onClick={() => {
              handleClose();
            }}
          >
            H???y
          </Button>
          <LoadingButton loading={showBackdrop} type="submit">
            L??u
          </LoadingButton>
        </FormFooter>
      </FormPaperGrid>
      <FormDialogSupplier
        open={openFormDialog}
        handleClose={handleCloseFormDialog}
      />
    </Dialog>
  );
};

export default FormDialog;
