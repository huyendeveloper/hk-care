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
import { IProductGroup } from 'interface';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import productGroupService from 'services/productGroup.service';
import * as yup from 'yup';

interface Props {
  open: boolean;
  handleClose: (updated?: boolean) => void;
  currentID?: number | null;
  data?: IProductGroup;
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Required').strict(true).default(''),
  description: yup.string().strict(true).default(''),
});

const FormDialog = ({ open, handleClose, currentID, data }: Props) => {
  const { control, handleSubmit, setValue, reset } = useForm<IProductGroup>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (payload: IProductGroup) => {
    try {
      if (payload.id) {
        await productGroupService.update(payload);
      } else {
        await productGroupService.create(payload);
      }
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
      setValue('description', data?.description || '');
    }
  }, [currentID]);

  return (
    <Dialog open={open} onClose={() => handleClose()}>
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader
          title={
            currentID
              ? 'Chỉnh sửa thông tin nhóm sản phẩm'
              : 'Thêm mới nhóm sản phẩm'
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
