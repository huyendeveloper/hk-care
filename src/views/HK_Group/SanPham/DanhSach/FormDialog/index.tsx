import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, Grid } from '@mui/material';
import {
  ControllerTextField,
  FormContent,
  FormFooter,
  FormGroup,
  FormHeader,
  FormLabel,
  FormPaperGrid,
} from 'components/Form';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { SanPham } from '../type';

interface Props {
  open: boolean;
  handleClose: () => void;
  currentID?: number | null;
  data?: SanPham;
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Required').strict(true).default(''),
  note: yup.string().strict(true).default(''),
});

const FormDialog = ({ open, handleClose, currentID, data }: Props) => {
  const { control, handleSubmit, setValue, reset } = useForm<SanPham>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (data: SanPham) => {
    // handle submit
  };

  useEffect(() => {
    reset();
    if (currentID) {
      setValue('id', currentID);
      setValue('name', data?.name || '');
      // setValue('note', data?.note || '');
    }
  }, [currentID]);

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={handleClose}>
      <FormPaperGrid
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: '100%' }}
      >
        <FormHeader
          title={
            currentID ? 'Chỉnh sửa thông tin sản phẩm' : 'Thêm mới sản phẩm'
          }
        />
        <FormContent>
          <FormGroup>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={6}>
                <Grid item xs={12}>
                  <FormLabel title="Mã sản phẩm" name="id" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="id" disabled control={control} />
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid item xs={12}>
                  <FormLabel required title="Tên sản phẩm" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="name" control={control} />
                </Grid>
              </Grid>

              {/* <Grid item xs={12}>
                <FormLabel title="Ghi chú" name="note" />
              </Grid>
              <Grid item xs={12}>
                <ControllerTextarea
                  maxRows={5}
                  minRows={5}
                  name="note"
                  control={control}
                />
              </Grid> */}
            </Grid>
          </FormGroup>
        </FormContent>

        <FormFooter>
          <Button variant="outlined" onClick={handleClose}>
            Hủy
          </Button>

          <LoadingButton type="submit">Lưu</LoadingButton>
        </FormFooter>
      </FormPaperGrid>
    </Dialog>
  );
};

export default FormDialog;
