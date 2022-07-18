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
  FormPaperGrid
} from 'components/Form';
import { connectURL } from 'config';
import { typeStringNumber } from 'constants/typeInput';
import { useNotification } from 'hooks';
import { ISupplier } from 'interface';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { createSupplier, updateSupplier } from 'redux/slices/supplier';
import supplierService from 'services/supplier.service';
import * as yup from 'yup';

interface Props {
  open: boolean;
  handleClose: (updated?: boolean) => void;
  currentID?: number | null;
  data?: ISupplier;
  fetchData?: () => void;
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

const FormDialogSupplier = ({
  open,
  handleClose,
  currentID,
  fetchData,
}: Props) => {
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [files, setFiles] = useState<File[] | object[]>([]);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);

  const { control, handleSubmit, setValue, reset } = useForm<ISupplier>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const handleUpdate = async (data: ISupplier) => {
    const { error, payload } = await dispatch(
      // @ts-ignore
      updateSupplier({ ...data, files })
    );
    if (error) {
      setNotification({
        error: payload.response.data || 'Lỗi!',
      });
      setShowBackdrop(false);
      return;
    }
    setNotification({
      message: 'Cập nhật thành công',
      severity: 'success',
    });
  };

  const handleAdd = async (data: ISupplier) => {
    const { error, payload } = await dispatch(
      // @ts-ignore
      createSupplier({ ...data, files })
    );
    if (error) {
      setNotification({
        error: payload.response.data || 'Lỗi!',
      });
      setShowBackdrop(false);
      return;
    }
    setNotification({ message: 'Thêm thành công', severity: 'success' });
  };

  const onSubmit = async (data: ISupplier) => {
    if (files.length === 0) {
      setNotification({
        message: 'Chưa có giấy chứng nhận',
        severity: 'warning',
      });
      return;
    }
    setShowBackdrop(true);
    if (data.id) {
      await handleUpdate(data);
    } else {
      await handleAdd(data);
    }

    fetchData && fetchData();
    reset();
    setFiles([]);
    handleClose(true);
    setShowBackdrop(false);
  };

  const fillFormData = async () => {
    setFiles([]);
    if (currentID) {
      const { data } = await supplierService.get(currentID);
      const {
        name,
        address,
        nameContact,
        telephoneNumber,
        mobileNumber,
        description,
        fax,
        taxCode,
        active,
        bussinessLicense,
      } = data;

      reset({
        id: currentID,
        name,
        address,
        nameContact,
        telephoneNumber,
        mobileNumber,
        description,
        fax,
        taxCode,
        active,
      });

      if (bussinessLicense) {
        const fileList: object[] = [];
        bussinessLicense.forEach((item: string) => {
          fileList.push({ name: `${connectURL}/${item}` });
        });
        setFiles(fileList);
      }
    }
  };

  useEffect(() => {
    reset({});
    fillFormData();
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
          <LoadingButton loading={showBackdrop} type="submit">
            Lưu
          </LoadingButton>
        </FormFooter>
      </FormPaperGrid>
    </Dialog>
  );
};

export default FormDialogSupplier;
