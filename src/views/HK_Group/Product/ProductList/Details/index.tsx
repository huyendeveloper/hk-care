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
import { useMounted } from 'hooks';
import { IProduct, ISupplier } from 'interface';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import productService from 'services/product.service';
import supplierService from 'services/supplier.service';
import * as yup from 'yup';
import TableData from '../../ProductList/TableData';
import FormDialog from '../FormDialog';
import Details from './Details';

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
  const [product, setProduct] = useState();
  const [taskQueue, setTaskQueue] = useState<number>(0);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const [fileValue, setFileValue] = useState<File | object>();
  const [tab, setTab] = useState<string>('1');
  const [supplierList, setSupplierList] = useState<ISupplier[]>([]);
  const [image, setImage] = useState<Blob | null | undefined>();

  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IProduct>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const fetchData = () => {
    if (!crudId) return;

    setTaskQueue((task) => task + 1);
    productService
      .get(Number(crudId))
      .then(({ data }) => setProduct(data))
      .catch((error) => console.error(error))
      .finally(() => {
        if (mounted.current) {
          setTaskQueue((task) => task - 1);
        }
      });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crudId]);

  const getFile = async (image: string) => {
    const { data } = await supplierService.getFile(image);
    setImage(data);
  };

  useEffect(() => {
    if (!product) return;

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
      productImage,
      amountFirst,
      amountSecond,
      suppliers,
      mesureLevelFisrt,
      mesureLevelSecond,
      mesureLevelThird,
    } = product;

    setValue('id', id);
    setValue('name', name);
    numberRegister && setValue('numberRegister', numberRegister);
    lotNumber && setValue('lotNumber', lotNumber);
    setValue('producer', producer);
    dateManufacture && setValue('dateManufacture', dateManufacture);
    outOfDate && setValue('outOfDate', outOfDate);
    setValue('importPrice', importPrice);
    setValue('price', price);
    setValue('packRule', packRule);
    setValue('content', content);
    setValue('dosage', dosage);
    setValue('routeOfUse', routeOfUse);
    setValue('description', description);
    setValue('hidden', hidden);
    setSupplierList(suppliers);
    getFile(productImage);
    // @ts-ignore
    setValue('usageId', usageO.id);
    // @ts-ignore
    setValue('usageName', usageO.name); // @ts-ignore
    setValue('productGroupId', productGroupO.id);
    // @ts-ignore
    setValue('productGroupName', productGroupO.name);
    // @ts-ignore
    setValue('treamentGroupId', treamentGroupO.id); // @ts-ignore
    setValue('treamentGroupName', treamentGroupO.name);
    setValue('productImage', productImage);
    productImage && getFile(productImage);
    setValue('amountFirst', amountFirst);
    amountSecond && setValue('amountSecond', amountSecond);
    setValue(
      'productsSupplier',
      // @ts-ignore
      suppliers.map((x) => x.id)
    ); // @ts-ignore
    setValue('mesureLevelFisrt', mesureLevelFisrt.id); // @ts-ignore
    setValue('mesureLevelFisrtName', mesureLevelFisrt.name); // @ts-ignore
    setValue('mesureLevelSecond', mesureLevelSecond.id); // @ts-ignore
    setValue('mesureLevelSecondName', mesureLevelSecond.name); // @ts-ignore
    setValue('mesureLevelThird', mesureLevelThird.id); // @ts-ignore
    setValue('mesureLevelThirdName', mesureLevelThird.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  if (taskQueue > 0) {
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

  return (
    <PageWrapper title="Sản phẩm">
      <FormPaperGrid noValidate>
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
                  options={[]}
                  renderLabel={(field) => ''}
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
                  options={[]}
                  renderLabel={(field) => ''}
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
                  options={[]}
                  renderLabel={(field) => ''}
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
                      options={[]}
                      renderLabel={(field) => ''}
                      noOptionsText="Không tìm thấy đơn vị đo lường"
                      defaultValue={getValues('mesureLevelFisrtName')}
                      placeholder="Cấp 1"
                      disabled
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
                      options={[]}
                      renderLabel={(field) => ''}
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
                      options={[]}
                      renderLabel={(field) => ''}
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
                  setImage={() => {}}
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
        currentID={product?.id}
        open={openFormDialog}
        handleClose={handleCloseUpdateDialog}
      />
    </PageWrapper>
  );
};

export default DetailsForm;
