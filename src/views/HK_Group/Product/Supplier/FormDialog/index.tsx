import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Dialog,
  Grid,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
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
import { ISupplier } from 'interface';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

interface Props {
  open: boolean;
  handleClose: (updated?: boolean) => void;
  currentID?: number | null;
  data?: ISupplier;
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Required').strict(true).default(''),
  description: yup.string().strict(true).default(''),
});

const FormDialog = ({ open, handleClose, currentID, data }: Props) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  const { control, handleSubmit, setValue, reset } = useForm<ISupplier>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (payload: ISupplier) => {
    try {
      // if (payload.id) {
      //   await measureService.update(payload);
      // } else {
      //   await measureService.create(payload);
      // }
      reset();
      handleClose(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    reset();
    if (currentID) {
      setValue('id', currentID);
      setValue('name', data?.name || '');
      setValue('address', data?.address || '');
      setValue('contactName', data?.contactName || '');
      setValue('phone', data?.phone || '');
      setValue('phone2', data?.phone2 || '');
      setValue('description', data?.description || '');
      setValue('fax', data?.fax || '');
      setValue('taxCode', data?.taxCode || '');
      setValue('certificate', data?.certificate || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentID]);

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={() => handleClose()}>
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader
          title={
            currentID
              ? 'Chỉnh sửa thông tin nhà cung cấp'
              : 'Thêm mới nhà cung cấp'
          }
        />
        <FormContent>
          <FormGroup>
            <Grid container spacing={2}>
              {currentID && (
                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="Mã nhà cung cấp" name="id" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField name="id" disabled control={control} />
                  </Grid>
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel required title="Tên nhà cung cấp" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="name" control={control} />
                </Grid>
              </Grid>
              {!mobile && !currentID && <Grid item xs={12} md={6}></Grid>}
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Địa chỉ" name="address" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="address" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Người liên hệ" name="contactName" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="contactName" control={control} />
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel required title="Điện thoại" name="phone" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="phone" control={control} />
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Di động" name="phone2" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="phone2" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Fax" name="fax" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="fax" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Mã số thuế" name="taxCode" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="taxCode" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 'auto' }}>
                  <Grid item xs={12}>
                    <FormLabel
                      required
                      title="Đính kèm giấy chứng nhận"
                      name="certificate"
                    />
                  </Grid>
                </Box>

                <Grid item xs={12}>
                  <ControllerTextField name="certificate" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Ghi chú" name="description" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextarea
                    maxRows={5}
                    minRows={5}
                    name="description"
                    control={control}
                  />
                </Grid>
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>

        <FormFooter>
          <Button variant="outlined" onClick={() => handleClose()}>
            Hủy
          </Button>
          <LoadingButton type="submit">Lưu</LoadingButton>
        </FormFooter>
      </FormPaperGrid>
    </Dialog>
  );
};

export default FormDialog;
