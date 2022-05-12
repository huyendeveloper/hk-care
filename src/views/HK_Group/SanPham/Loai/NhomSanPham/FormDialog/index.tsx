import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Dialog, Grid, Button } from '@mui/material';
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
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { DangDung } from '../type';

interface Props {
  open: boolean;
  handleClose: () => void;
  currentID?: number | null;
  data?: DangDung;
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Required').strict(true).default(''),
  note: yup.string().strict(true).default(''),
});

const FormDialog = ({ open, handleClose, currentID, data }: Props) => {
  const { control, handleSubmit, setValue, reset } = useForm<DangDung>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (data: DangDung) => {
    // handle submit
  };

  useEffect(() => {
    reset();
    if (currentID) {
      setValue('id', currentID);
      setValue('name', data?.name || '');
      setValue('note', data?.note || '');
    }
  }, [currentID]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader
          title={
            currentID ? 'Chỉnh sửa thông tin nhóm sản phẩm' : 'Thêm mới nhóm sản phẩm'
          }
        />
        <FormContent>
          <FormGroup>
            <Grid container alignItems="center" spacing={2}>
              {currentID && (
                <>
                  <Grid item xs={12}>
                    <FormLabel title="Mã nhóm sản phẩm" name="id" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField name="id" disabled control={control} />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <FormLabel required title="Tên nhóm sản phẩm" name="name" />
              </Grid>
              <Grid item xs={12}>
                <ControllerTextField name="name" control={control} />
              </Grid>
              <Grid item xs={12}>
                <FormLabel title="Ghi chú" name="note" />
              </Grid>
              <Grid item xs={12}>
                <ControllerTextarea
                  maxRows={5}
                  minRows={5}
                  name="note"
                  control={control}
                />
              </Grid>
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
