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
import ControllerSwitch from 'components/Form/ControllerSwitch';
import { typeStringNumber } from 'constants/typeInput';
import { useNotification } from 'hooks';
import { ITenant } from 'interface';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

interface Props {
  open: boolean;
  handleClose: (updated?: boolean) => void;
  currentID?: string | null;
  data?: ITenant;
  loading?: boolean;
  disable: boolean;
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
    .required('Vui lòng nhập tên điểm bán.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập tên điểm bán.')
    .max(150, 'Tên điểm bán không quá 150 ký tự.')
    .strict(true)
    .default(''),
  hotline: yup
    .string()
    .required('Vui lòng nhập hotline.')
    .strict(true)
    .default(''),
  address: yup
    .string()
    .required('Vui lòng nhập địa chỉ.')
    .max(150, 'Địa chỉ không quá 150 ký tự.')
    .default(''),
  status: yup.boolean().default(true),
});

const FormDialog = ({
  open,
  handleClose,
  currentID,
  disable,
  loading = false,
}: Props) => {
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [files, setFiles] = useState<File[] | object[]>([]);
  const [disabled, setDisabled] = useState<boolean>(disable);

  const { control, handleSubmit, setValue, reset } = useForm<ITenant>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  useEffect(() => {
    setDisabled(disable);
  }, [disable, open]);

  const status = useWatch({ control, name: 'status' });

  const fetchData = async () => {
    setFiles([]);
    if (currentID) {
      // const { data } = await supplierService.get(currentID);
      // setValue('id', currentID);
      // setValue('name', data?.name || '');
      // setValue('address', data?.address || '');
      // setValue('nameContact', data?.nameContact || '');
      // setValue('telephoneNumber', data?.telephoneNumber || '');
      // setValue('mobileNumber', data?.mobileNumber || '');
      // setValue('description', data?.description || '');
      // setValue('fax', data?.fax || '');
      // setValue('taxCode', data?.taxCode || '');
      // setValue('active', data?.active);
      // if (data?.bussinessLicense) {
      //   const fileList: object[] = [];
      //   data.bussinessLicense.forEach((item: string) => {
      //     fileList.push({ name: `${connectURL}/${item}` });
      //   });
      //   setFiles(fileList);
      // }
      reset({
        id: '1',
        name: 'Salvidor',
        address: 'Joselin',
        hotline: '355-395-4971',
        status: false,
      });
    }
  };

  useEffect(() => {
    reset({ status: true });
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentID, open]);

  const onSubmit = async (tenant: ITenant) => {
    // if (files.length === 0) {
    //   setNotification({
    //     message: 'Chưa có giấy chứng nhận',
    //     severity: 'warning',
    //   });
    //   return;
    // }
    // if (tenant.id) {
    //   const { error, payload } = await dispatch(
    //     // @ts-ignore
    //     updateSupplier({ ...tenant, files })
    //   );
    //   if (error) {
    //     setNotification({
    //       error: payload.response.data || 'Lỗi!',
    //     });
    //     return;
    //   }
    //   setNotification({
    //     message: 'Cập nhật thành công',
    //     severity: 'success',
    //   });
    // } else {
    //   const { error, payload } = await dispatch(
    //     // @ts-ignore
    //     createSupplier({ ...tenant, files })
    //   );
    //   if (error) {
    //     setNotification({
    //       error: payload.response.data || 'Lỗi!',
    //     });
    //     return;
    //   }
    //   setNotification({ message: 'Thêm thành công', severity: 'success' });
    // }
    // reset({});
    // setFiles([]);
    // handleClose(true);
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={() => handleClose()}>
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader
          title={
            currentID ? 'Chỉnh sửa thông tin điểm bán' : 'Thêm mới điểm bán'
          }
        />
        <FormContent>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel required title="Tên điểm bán" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField
                    name="name"
                    control={control}
                    disabled={disabled}
                    helperText={
                      <>
                        HK [ĐỊA CHỈ ĐIỂM BÁN]
                        <br />
                        VD: HK 39 Núi Trúc
                      </>
                    }
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Người liên hệ" name="nameContact" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField
                    name="nameContact"
                    control={control}
                    disabled={disabled}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Hotline" required name="hotline" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField
                    inputProps={typeStringNumber((value) =>
                      setValue('hotline', value)
                    )}
                    name="hotline"
                    control={control}
                    disabled={disabled}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Di động" name="phone" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField
                    inputProps={typeStringNumber((value) =>
                      setValue('phone', value)
                    )}
                    name="phone"
                    control={control}
                    disabled={disabled}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Địa chỉ" required name="address" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField
                    name="address"
                    control={control}
                    disabled={disabled}
                  />
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
                    disabled={disabled}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 'auto' }}>
                  <Grid item xs={12}>
                    <FormLabel
                      title="Tài liệu đính kèm"
                      name="bussinessLicense"
                    />
                  </Grid>
                </Box>

                <Grid item xs={12}>
                  <ControllerMultiFile
                    files={files}
                    setFiles={setFiles}
                    viewOnly={disabled}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}></Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 'auto' }}>
                  <Grid item xs={12}>
                    <FormLabel
                      title="Trạng thái hoạt động"
                      name="bussinessLicense"
                    />
                  </Grid>
                </Box>

                <Grid item xs={12}>
                  <ControllerSwitch
                    name="status"
                    label={status ? 'Hoạt động' : 'Không hoạt động'}
                    control={control}
                    disabled={disabled}
                  />
                </Grid>
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>

        <FormFooter>
          <Button variant="outlined" onClick={() => handleClose()}>
            {disabled ? 'Đóng' : 'Hủy'}
          </Button>
          {disabled && (
            <Button onClick={() => setDisabled(false)}>
              Chỉnh sửa thông tin
            </Button>
          )}
          {!disabled && <LoadingButton type="submit">Lưu</LoadingButton>}
        </FormFooter>
      </FormPaperGrid>
    </Dialog>
  );
};

export default FormDialog;
