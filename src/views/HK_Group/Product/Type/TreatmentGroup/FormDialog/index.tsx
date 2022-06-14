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
import { ITreatmentGroup } from 'interface';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  createTreatmentGroup,
  updateTreatmentGroup,
} from 'redux/slices/treatmentGroup';
import { RootState } from 'redux/store';
import * as yup from 'yup';

interface Props {
  open: boolean;
  handleClose: (updated?: boolean) => void;
  currentID?: number | null;
  data?: ITreatmentGroup;
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
    .required('Vui lòng nhập tên nhóm điều trị.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập tên nhóm điều trị.')
    .max(100, 'Tên nhóm điều trị không quá 100 ký tự.')
    .strict(true)
    .default(''),
  description: yup.string().strict(true).default(''),
});

const FormDialog = ({ open, handleClose, currentID, data, disable }: Props) => {
  const { loading } = useSelector((state: RootState) => state.treatmentGroup);
  const [disabled, setDisabled] = useState<boolean>(disable);
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const { control, handleSubmit, setValue, reset } = useForm<ITreatmentGroup>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (data: ITreatmentGroup) => {
    if (data.id) {
      // @ts-ignore
      const { error, payload } = await dispatch(updateTreatmentGroup(data));
      if (error) {
        setNotification({
          error: payload.response.data || 'Lỗi khi cập nhật nhóm điều trị!',
        });
        return;
      }
      setNotification({
        message: 'Cập nhật thành công',
        severity: 'success',
      });
    } else {
      // @ts-ignore
      const { error, payload } = await dispatch(createTreatmentGroup(data));
      if (error) {
        setNotification({
          error: payload.response.data || 'Lỗi khi thêm nhóm điều trị!',
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
              ? 'Xem chi tiết nhóm điều trị'
              : currentID
              ? 'Chỉnh sửa thông tin nhóm điều trị'
              : 'Thêm mới nhóm điều trị'
          }
        />
        <FormContent>
          <FormGroup>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12}>
                <FormLabel required title="Tên nhóm điều trị" name="name" />
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
            {disabled ? 'Đóng' : 'Hủy'}
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
