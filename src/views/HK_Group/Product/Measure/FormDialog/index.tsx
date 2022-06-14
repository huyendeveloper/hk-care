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
import { IMeasure } from 'interface';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createMeasure, updateMeasure } from 'redux/slices/measure';
import { RootState } from 'redux/store';
import * as yup from 'yup';

interface Props {
  open: boolean;
  handleClose: (updated?: boolean) => void;
  currentID?: number | null;
  data?: IMeasure;
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
    .required('Vui lòng nhập tên đơn vị đo lường.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập tên đơn vị đo lường.')
    .max(100, 'Tên đơn vị đo lường không quá 100 ký tự.')
    .strict(true)
    .default(''),
  description: yup.string().strict(true).default(''),
});

const FormDialog = ({ open, handleClose, currentID, data, disable }: Props) => {
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const { loading } = useSelector((state: RootState) => state.measure);
  const [disabled, setDisabled] = useState<boolean>(disable);

  const { control, handleSubmit, setValue, reset } = useForm<IMeasure>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (data: IMeasure) => {
    if (data.id) {
      // @ts-ignore
      const { error, payload } = await dispatch(updateMeasure(data));
      if (error) {
        setNotification({
          error: payload.response.data || 'Lỗi khi cập nhật đơn vị đo lường!',
        });
        return;
      }
      setNotification({
        message: 'Cập nhật thành công',
        severity: 'success',
      });
    } else {
      // @ts-ignore
      const { error, payload } = await dispatch(createMeasure(data));
      if (error) {
        setNotification({
          error: payload.response.data || 'Lỗi khi thêm đơn vị đo lường!',
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

  useEffect(() => {
    setDisabled(disable);
  }, [disable, open]);

  return (
    <Dialog open={open} onClose={() => handleClose()}>
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader
          title={
            disabled
              ? 'Xem chi tiết đơn vị đo lường'
              : currentID
              ? 'Chỉnh sửa thông tin đơn vị đo lường'
              : 'Thêm mới đơn vị đo lường'
          }
        />
        <FormContent>
          <FormGroup>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12}>
                <FormLabel required title="Tên đơn vị đo lường" name="name" />
              </Grid>
              <Grid item xs={12}>
                <ControllerTextField
                  disabled={disabled}
                  name="name"
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
                  disabled={disabled}
                  name="description"
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
