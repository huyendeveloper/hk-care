import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import { LinkButton, LoadingScreen, PageWrapper } from 'components/common';
import {
  ControllerTextarea,
  ControllerTextField,
  FormContent,
  FormFooter,
  FormGroup,
  FormHeader,
  FormLabel,
  FormPaperGrid,
} from 'components/Form';
import { useMounted } from 'hooks';
import { ISupplier } from 'interface';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import supplierService from 'services/supplier.service';
import * as yup from 'yup';
import FormDialog from '../FormDialog';

const validationSchema = yup.object().shape({
  name: yup.string().required('Required').strict(true).default(''),
  description: yup.string().strict(true).default(''),
});

const DetailsForm = () => {
  const { id: crudId } = useParams();
  const mounted = useMounted();
  const [supplier, setSupplier] = useState<ISupplier>();
  const [taskQueue, setTaskQueue] = useState<number>(0);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const [fileValue, setFileValue] = useState<File | object>();

  const { control, setValue } = useForm<ISupplier>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const fetchData = () => {
    if (!crudId) return;

    setTaskQueue((task) => task + 1);
    supplierService
      .get(Number(crudId))
      .then(({ data }) => setSupplier(data))
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

  const getFile = async (bussinessLicense: string) => {
    const { data } = await supplierService.getFile(bussinessLicense);
    setFileValue({ name: data });
  };

  useEffect(() => {
    if (!supplier) return;

    const {
      id,
      name,
      address,
      nameContact,
      telephoneNumber,
      mobileNumber,
      description,
      fax,
      taxCode,
      bussinessLicense,
    } = supplier;

    setValue('id', id);
    setValue('name', name);
    setValue('address', address);
    setValue('nameContact', nameContact);
    setValue('telephoneNumber', telephoneNumber);
    setValue('mobileNumber', mobileNumber);
    setValue('description', description);
    setValue('fax', fax);
    setValue('taxCode', taxCode);
    if (bussinessLicense) {
      getFile(bussinessLicense);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier]);

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

  return (
    <PageWrapper title="Nhà cung cấp">
      <FormPaperGrid noValidate>
        <FormHeader title="Xem chi tiết nhà cung cấp" />
        <FormContent>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormLabel required title="Tên nhà cung cấp" name="name" />
                <ControllerTextField disabled name="name" control={control} />
              </Grid>
              {!mobile && <Grid item xs={12} md={6}></Grid>}
              <Grid item xs={6}>
                <FormLabel title="Địa chỉ" name="address" />
                <ControllerTextField
                  disabled
                  name="address"
                  control={control}
                />
              </Grid>
              <Grid item xs={6}>
                <FormLabel title="Người liên hệ" name="nameContact" />
                <ControllerTextField
                  disabled
                  name="nameContact"
                  control={control}
                />
              </Grid>
              <Grid item xs={6}>
                <FormLabel required title="Điện thoại" name="telephoneNumber" />
                <ControllerTextField
                  disabled
                  name="telephoneNumber"
                  control={control}
                />
              </Grid>
              <Grid item xs={6}>
                <FormLabel title="Di động" name="mobileNumber" />
                <ControllerTextField
                  disabled
                  name="mobileNumber"
                  control={control}
                />
              </Grid>
              <Grid item xs={6}>
                <FormLabel title="Fax" name="fax" />
                <ControllerTextField disabled name="fax" control={control} />
              </Grid>
              <Grid item xs={6}>
                <FormLabel title="Mã số thuế" name="taxCode" />
                <ControllerTextField
                  disabled
                  name="taxCode"
                  control={control}
                />
              </Grid>
              <Grid item xs={6}>
                <FormLabel
                  required
                  title="Đính kèm giấy chứng nhận"
                  name="bussinessLicense"
                />
                <Button variant="contained" fullWidth component="label">
                  {/* @ts-ignore */}
                  {fileValue?.name ? fileValue.name : 'Không có chứng nhận'}
                  <input
                    disabled
                    type="file"
                    name="bussinessLicense"
                    accept="application/pdf"
                    hidden
                  />
                </Button>
              </Grid>
              <Grid item xs={6}>
                <FormLabel title="Ghi chú" name="description" />
                <ControllerTextarea
                  maxRows={5}
                  minRows={5}
                  name="description"
                  control={control}
                  disabled
                />
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>
        <FormFooter>
          <LinkButton to="/hk_group/product/supplier">Quay lại</LinkButton>

          <Button variant="contained" onClick={handleOpenUpdateDialog}>
            Chỉnh sửa thông tin
          </Button>
        </FormFooter>
      </FormPaperGrid>
      <FormDialog
        currentID={supplier?.id}
        data={supplier}
        open={openFormDialog}
        handleClose={handleCloseUpdateDialog}
      />
    </PageWrapper>
  );
};

export default DetailsForm;
