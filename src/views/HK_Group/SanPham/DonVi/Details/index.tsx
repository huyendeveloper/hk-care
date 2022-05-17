import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid } from '@mui/material';
import { LinkButton, LoadingScreen, PageWrapper } from 'components/common';
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
import { useMounted } from 'hooks';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { getDangDungDetails } from 'services/crud';
import * as yup from 'yup';
import FormDialog from '../FormDialog';
import { DangDung } from '../type';

const validationSchema = yup.object().shape({
  name: yup.string().required('Required').strict(true).default(''),
  note: yup.string().strict(true).default(''),
});

const DetailsForm = () => {
  const { id: crudId } = useParams();
  const mounted = useMounted();
  const [dangDung, setDangDung] = useState<DangDung>();
  const [taskQueue, setTaskQueue] = useState<number>(0);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const { control, setValue } = useForm<DangDung>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  useEffect(() => {
    if (!crudId) return;

    setTaskQueue((task) => task + 1);
    getDangDungDetails(crudId)
      .then((res) => {
        setDangDung(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        if (mounted.current) {
          setTaskQueue((task) => task - 1);
        }
      });
  }, [crudId, mounted]);

  useEffect(() => {
    if (!dangDung) return;

    const { name, note } = dangDung;

    setValue('id', Number(crudId));
    setValue('name', name);
    setValue('note', note);
  }, [dangDung]);

  if (taskQueue > 0) {
    return <LoadingScreen />;
  }

  const handleOpenUpdateDialog = () => {
    setOpenFormDialog(true);
  };

  return (
    <PageWrapper title="Đơn vị đo lường">
      <FormPaperGrid noValidate>
        <FormHeader title="Xem chi tiết đơn vị đo lường" />
        <FormContent>
          <FormGroup>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12}>
                <FormLabel title="Mã đơn vị đo lường" name="id" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ControllerTextField name="id" disabled control={control} />
              </Grid>
              <Grid item xs={12}>
                <FormLabel required title="Tên đơn vị đo lường" name="name" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ControllerTextField disabled name="name" control={control} />
              </Grid>
              <Grid item xs={12}>
                <FormLabel title="Ghi chú" name="note" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ControllerTextarea
                  maxRows={5}
                  minRows={5}
                  name="note"
                  control={control}
                  disabled
                />
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>
        <FormFooter>
          <LinkButton to="/hk_group/product/don_vi">Quay lại</LinkButton>

          <Button variant="contained" onClick={handleOpenUpdateDialog}>
            Chỉnh sửa thông tin
          </Button>
        </FormFooter>
      </FormPaperGrid>
      <FormDialog
        currentID={dangDung?.id}
        data={dangDung}
        open={openFormDialog}
        handleClose={() => setOpenFormDialog(false)}
      />
    </PageWrapper>
  );
};

export default DetailsForm;
