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
import { IProductGroup } from 'interface';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import {
  createProductGroup,
  updateProductGroup,
} from 'redux/slices/productGroup';
import * as yup from 'yup';

interface Props {
  open: boolean;
  handleClose: (updated?: boolean) => void;
  currentID?: number | null;
  data?: IProductGroup;
  disable: boolean;
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
    .required('Vui lòng nhập tên nhóm sản phẩm.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập tên nhóm sản phẩm.')
    .min(2, 'Tên nhóm sản phẩm ít nhất 2 ký tự.')
    .max(100, 'Tên nhóm sản phẩm không quá 100 ký tự.')
    .strict(true)
    .default(''),
  description: yup.string().strict(true).default(''),
});

const FormDialog = ({
  open,
  handleClose,
  currentID,
  data,
  disable,
  fetchData,
}: Props) => {
  const [disabled, setDisabled] = useState<boolean>(disable);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const { control, handleSubmit, reset } = useForm<IProductGroup>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  useEffect(() => {
    setDisabled(disable);
  }, [disable, open]);

  const handleUpdate = async (data: IProductGroup) => {
    // @ts-ignore
    const { error, payload } = await dispatch(updateProductGroup(data));
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

  const handleAdd = async (data: IProductGroup) => {
    // @ts-ignore
    const { error, payload } = await dispatch(createProductGroup(data));
    if (error) {
      setNotification({
        error: payload.response.data || 'Lỗi!',
      });
      setShowBackdrop(false);
      return;
    }
    setNotification({ message: 'Thêm thành công', severity: 'success' });
  };

  const onSubmit = async (data: IProductGroup) => {
    setShowBackdrop(true);
    if (data.id) {
      await handleUpdate(data);
    } else {
      await handleAdd(data);
    }

    fetchData();
    reset();
    handleClose();
    setShowBackdrop(false);
  };

  useEffect(() => {
    if (currentID) {
      reset({
        id: currentID,
        name: data?.name || '',
        description: data?.description || '',
      });
      return;
    }
    reset({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentID, open]);

  return (
    <Dialog open={open} onClose={() => handleClose()}>
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader
          title={
            disabled
              ? 'Xem chi tiết nhóm sản phẩm'
              : currentID
              ? 'Chỉnh sửa thông tin nhóm sản phẩm'
              : 'Thêm mới nhóm sản phẩm'
          }
        />
        <FormContent>
          <FormGroup>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12}>
                <FormLabel required title="Tên nhóm sản phẩm" name="name" />
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
            <LoadingButton loading={showBackdrop} type="submit">
              Lưu
            </LoadingButton>
          )}
        </FormFooter>
      </FormPaperGrid>
    </Dialog>
  );
};

export default FormDialog;
