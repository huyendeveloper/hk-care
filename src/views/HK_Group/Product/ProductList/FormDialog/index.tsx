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
    .required('Vui lòng nhập tên sản phẩm.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập tên sản phẩm.'),
  productGroupId: yup
    .number()
    .required('Vui lòng chọn nhóm sản phẩm.')
    .typeError('Vui lòng chọn nhóm sản phẩm.')
    .integer('Vui lòng chọn nhóm sản phẩm.')
    .min(0, 'Vui lòng chọn nhóm sản phẩm.'),
  treamentGroupId: yup
    .number()
    .required('Vui lòng chọn nhóm điều trị.')
    .typeError('Vui lòng chọn nhóm điều trị.')
    .integer('Vui lòng chọn nhóm điều trị.')
    .min(0, 'Vui lòng chọn nhóm điều trị.'),
  usageId: yup
    .number()
    .required('Vui lòng chọn dạng dùng.')
    .typeError('Vui lòng chọn dạng dùng.')
    .integer('Vui lòng chọn dạng dùng.')
    .min(0, 'Vui lòng chọn dạng dùng.'),
  mesureLevelFisrt: yup
    .number()
    .required('Vui lòng chọn đơn vị cấp 1.')
    .typeError('Vui lòng chọn đơn vị cấp 1.')
    .integer('Vui lòng chọn đơn vị cấp 1.')
    .min(0, 'Vui lòng chọn đơn vị cấp 1.'),
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
      routeOfUse: 'Theo chỉ định',
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
          error: payload.response.data || 'Hệ thống đang gặp sự cố',
        });
        setShowBackdrop(false);
        return;
      }
      setNotification({
        message: 'Cập nhật thành công',
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
          error: payload.response.data || 'Hệ thống đang gặp sự cố',
        });
        setShowBackdrop(false);
        return;
      }
      setNotification({ message: 'Thêm thành công', severity: 'success' });
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
            currentID ? 'Chỉnh sửa thông tin sản phẩm' : 'Thêm mới sản phẩm'
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
                    <FormLabel required title="Tên sản phẩm" name="name" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField name="name" control={control} />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel
                      required
                      title="Nhóm sản phẩm"
                      name="productGroupId"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <EntitySelecter
                      name="productGroupId"
                      control={control}
                      options={productGroupList}
                      renderLabel={(field) => field.name}
                      noOptionsText="Không tìm thấy nhóm sản phẩm"
                      placeholder=""
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="Số đăng ký" name="numberRegister" />
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
                      title="Nhóm điều trị"
                      name="treamentGroupId"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <EntitySelecter
                      name="treamentGroupId"
                      control={control}
                      options={treatmentGroupList}
                      renderLabel={(field) => field.name}
                      noOptionsText="Không tìm thấy nhóm điều trị"
                      placeholder=""
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="Số lô" name="lotNumber" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField name="lotNumber" control={control} />
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel required title="Dạng dùng" name="usageId" />
                  </Grid>
                  <Grid item xs={12}>
                    <EntitySelecter
                      name="usageId"
                      control={control}
                      options={usageList}
                      renderLabel={(field) => field.name}
                      noOptionsText="Không tìm thấy nhóm dạng dùng"
                      placeholder=""
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="Hạn sử dụng" name="outOfDate" />
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
                      title="Đơn vị"
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
                        noOptionsText="Không tìm thấy đơn vị đo lường"
                        placeholder="Cấp 1 *"
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
                        noOptionsText="Không tìm thấy đơn vị đo lường"
                        placeholder="Cấp 2"
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
                        noOptionsText="Không tìm thấy đơn vị đo lường"
                        placeholder="Cấp 3"
                      />
                    </Grid>
                    <Grid item xs={6} md={2}></Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="Nhà sản xuất" name="producer" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField name="producer" control={control} />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="Ngày sản xuất" name="dateManufacture" />
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
                    <FormLabel title="Giá nhập" name="importPrice" />
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
                    <FormLabel title="Giá bán" name="price" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerNumberInput
                      name="price"
                      // @ts-ignore
                      setValue={setValue}
                      control={control}
                      value={getValues('price')}
                      errors={
                        importPrice > price ? 'Giá bán không hợp lệ!' : ''
                      }
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <FormLabel title="Nhà cung cấp" name="productsSupplier" />
                  </Grid>
                  <Stack flexDirection={'row'}>
                    <Box sx={{ width: '100%' }}>
                      <EntityMultipleSelecter
                        name="productsSupplier"
                        control={control}
                        options={supplierList}
                        renderLabel={(field) => field.name}
                        noOptionsText="Không tìm thấy nhà cung cấp"
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
                    <FormLabel title="Quy cách đóng gói" name="packRule" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField name="packRule" control={control} />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <FormLabel title="Hoạt chất" name="content" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField name="content" control={control} />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <FormLabel required title="Hàm lượng" name="dosage" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField name="dosage" control={control} />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <FormLabel required title="Liều dùng" name="routeOfUse" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField name="routeOfUse" control={control} />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="Hình ảnh sản phẩm" name="productImage" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerImageField image={image} setImage={setImage} />
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
            Hủy
          </Button>
          <LoadingButton loading={showBackdrop} type="submit">
            Lưu
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
