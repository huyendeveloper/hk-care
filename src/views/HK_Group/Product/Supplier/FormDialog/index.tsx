import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Dialog, Grid } from '@mui/material';
import {
  ControllerMultiFile,
  ControllerTextarea,
  ControllerTextField,
  FormContent,
  FormFooter,
  FormGroup,
  FormHeader,
  FormLabel,
  FormPaperGrid,
} from 'components/Form';
import { connectURL } from 'config';
import { typeStringNumber } from 'constants/typeInput';
import { useNotification } from 'hooks';
import { ISupplier } from 'interface';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createSupplier, updateSupplier } from 'redux/slices/supplier';
import { RootState } from 'redux/store';
import supplierService from 'services/supplier.service';
import * as yup from 'yup';

interface Props {
  open: boolean;
  handleClose: (updated?: boolean) => void;
  currentID?: number | null;
  data?: ISupplier;
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
    .required('Vui lòng nhập tên nhà cung cấp.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập tên nhà cung cấp.')
    .max(150, 'Tên nhà cung cấp không quá 150 ký tự.')
    .strict(true)
    .default(''),
  telephoneNumber: yup
    .string()
    .required('Vui lòng nhập số điện thoại.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập số điện thoại.')
    .min(9, 'Số điện thoại từ 9 đến 20 ký tự.')
    .max(20, 'Số điện thoại từ 9 đến 20 ký tự.')
    .strict(true)
    .default(''),
  address: yup.string().max(150, 'Địa chỉ không quá 150 ký tự.').default(''),
});

const FormDialogSupplier = ({ open, handleClose, currentID }: Props) => {
  const [files, setFiles] = useState<File[] | object[]>([]);
  const setNotification = useNotification();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.supplier);

  const { control, handleSubmit, setValue, reset } = useForm<ISupplier>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (supplier: ISupplier) => {
    if (files.length === 0) {
      setNotification({
        message: 'Chưa có giấy chứng nhận',
        severity: 'warning',
      });
      return;
    }

    if (supplier.id) {
      const { error, payload } = await dispatch(
        // @ts-ignore
        updateSupplier({ ...supplier, files })
      );
      if (error) {
        setNotification({
          error: payload.response.data || 'Lỗi khi cập nhật nhà cung cấp!',
        });
        return;
      }
      setNotification({
        message: 'Cập nhật thành công',
        severity: 'success',
      });
    } else {
      const { error, payload } = await dispatch(
        // @ts-ignore
        createSupplier({ ...supplier, files })
      );
      if (error) {
        setNotification({
          error: payload.response.data || 'Lỗi khi thêm nhà cung cấp!',
        });
        return;
      }
      setNotification({ message: 'Thêm thành công', severity: 'success' });
    }

    reset();
    setFiles([]);
    handleClose(true);
  };

  const fetchData = async () => {
    setFiles([]);
    if (currentID) {
      const { data } = await supplierService.get(currentID);
      setValue('id', currentID);
      setValue('name', data?.name || '');
      setValue('address', data?.address || '');
      setValue('nameContact', data?.nameContact || '');
      setValue('telephoneNumber', data?.telephoneNumber || '');
      setValue('mobileNumber', data?.mobileNumber || '');
      setValue('description', data?.description || '');
      setValue('fax', data?.fax || '');
      setValue('taxCode', data?.taxCode || '');
      setValue('active', data?.active);
      if (data?.bussinessLicense) {
        const fileList: object[] = [];
        data.bussinessLicense.forEach((item: string) => {
          fileList.push({ name: `${connectURL}/${item}` });
        });
        setFiles(fileList);
      }
    }
  };

  useEffect(() => {
    reset();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentID, open]);

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
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel required title="Tên nhà cung cấp" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="name" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Người liên hệ" name="nameContact" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="nameContact" control={control} />
                </Grid>
              </Grid>
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
                  <FormLabel title="Di động" name="mobileNumber" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="mobileNumber" control={control} />
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel
                    required
                    title="Điện thoại"
                    name="telephoneNumber"
                  />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField
                    inputProps={typeStringNumber((value) =>
                      setValue('telephoneNumber', value)
                    )}
                    name="telephoneNumber"
                    control={control}
                  />
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
                <Grid item xs={12}>
                  <FormLabel title="Fax" name="fax" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="fax" control={control} />
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
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 'auto' }}>
                  <Grid item xs={12}>
                    <FormLabel
                      required
                      title="Đính kèm giấy chứng nhận"
                      name="bussinessLicense"
                    />
                  </Grid>
                </Box>

                <Grid item xs={12}>
                  <ControllerMultiFile files={files} setFiles={setFiles} />
                </Grid>
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>

        <FormFooter>
          <Button variant="outlined" onClick={() => handleClose()}>
            Hủy
          </Button>
          <LoadingButton loading={loading} type="submit">
            Lưu
          </LoadingButton>
        </FormFooter>
      </FormPaperGrid>
    </Dialog>
  );
};

export default FormDialogSupplier;
