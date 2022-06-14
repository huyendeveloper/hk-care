import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, Grid } from '@mui/material';
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
import { useNotification } from 'hooks';
import { IUsage } from 'interface';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createUsage, updateUsage } from 'redux/slices/usage';
import { RootState } from 'redux/store';
import * as yup from 'yup';

interface Props {
  open: boolean;
  handleClose: (updated?: boolean) => void;
  currentID?: number | null;
  data?: IUsage;
  disable?: boolean;
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
    // @ts-ignore
    .trimCustom('Vui lòng nhập tên dạng dùng.')
    .required('Vui lòng nhập tên dạng dùng.')
    .max(100, 'Tên dạng dùng không quá 100 ký tự.')
    .strict(true)
    .default(''),
  description: yup.string().strict(true).default(''),
});

const FormDialog = ({
  open,
  handleClose,
  currentID,
  data,
  disable = false,
}: Props) => {
  const { loading } = useSelector((state: RootState) => state.usage);
  const setNotification = useNotification();
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState<boolean>(disable);
  const { control, handleSubmit, setValue, reset } = useForm<IUsage>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  useEffect(() => {
    setDisabled(disable);
  }, [disable, open]);

  const onSubmit = async (data: IUsage) => {
    if (data.id) {
      // @ts-ignore
      const { error, payload } = await dispatch(updateUsage(data));
      if (error) {
        setNotification({
          error: payload.response.data || 'Lỗi khi cập nhật dạng dùng!',
        });
        return;
      }
      setNotification({
        message: 'Cập nhật thành công',
        severity: 'success',
      });
    } else {
      // @ts-ignore
      const { error, payload } = await dispatch(createUsage(data));
      if (error) {
        setNotification({
          error: payload.response.data || 'Lỗi khi thêm dạng dùng!',
        });
        return;
      }
      setNotification({ message: 'Thêm thành công', severity: 'success' });
    }

    reset();
    handleClose(true);
  };

  useEffect(() => {
    reset();
    if (currentID) {
      setValue('id', currentID);
      setValue('name', data?.name || '');
      setValue('description', data?.description || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentID, open]);

  return (
    <Dialog open={open} onClose={() => handleClose()}>
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader
          title={
            disabled
              ? 'Xem chi tiết dạng dùng'
              : currentID
              ? 'Chỉnh sửa thông tin dạng dùng'
              : 'Thêm mới dạng dùng'
          }
        />
        <FormContent>
          <FormGroup>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12}>
                <FormLabel required title="Tên dạng dùng" name="name" />
              </Grid>
              <Grid item xs={12}>
                <ControllerTextField
                  name="name"
                  disabled={disabled}
                  control={control}
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel title="Ghi chú" name="description" />
              </Grid>
              <Grid item xs={12}>
                <ControllerTextarea
                  maxRows={5}
                  minRows={5}
                  name="description"
                  disabled={disabled}
                  control={control}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>

        <FormFooter>
          <Button variant="outlined" onClick={() => handleClose()}>
            {disabled ? 'Quay lại' : 'Hủy'}
          </Button>
          {disabled && (
            <Button onClick={() => setDisabled(false)}>
              Chỉnh sửa thông tin
            </Button>
          )}
          {!disabled && (
            <LoadingButton loading={loading} type="submit">
              Lưu
            </LoadingButton>
          )}
        </FormFooter>
      </FormPaperGrid>
    </Dialog>
  );
};

export default FormDialog;
