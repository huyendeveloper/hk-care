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
import { IProductGroup } from 'interface';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import productGroupService from 'services/productGroup.service';
import * as yup from 'yup';
import FormDialog from '../FormDialog';

const validationSchema = yup.object().shape({
  name: yup.string().required('Required').strict(true).default(''),
  description: yup.string().strict(true).default(''),
});

const DetailsForm = () => {
  const { id: crudId } = useParams();
  const mounted = useMounted();
  const [productGroup, setProductGroup] = useState<IProductGroup>();
  const [taskQueue, setTaskQueue] = useState<number>(0);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const { control, setValue } = useForm<IProductGroup>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const fetchData = () => {
    if (!crudId) return;

    setTaskQueue((task) => task + 1);
    productGroupService
      .get(Number(crudId))
      .then(({ data }) => setProductGroup(data))
      .catch((error) => console.error(error))
      .finally(() => {
        if (mounted.current) {
          setTaskQueue((task) => task - 1);
        }
      });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crudId]);

  useEffect(() => {
    if (!productGroup) return;

    const { id, name, description } = productGroup;

    setValue('id', id);
    setValue('name', name);
    setValue('description', description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productGroup]);

  if (taskQueue > 0) {
    return <LoadingScreen />;
  }

  const handleOpenUpdateDialog = () => {
    setOpenFormDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenFormDialog(false);
    fetchData();
  };

  return (
    <PageWrapper title="Nhóm sản phẩm">
      <FormPaperGrid noValidate>
        <FormHeader title="Xem chi tiết nhóm sản phẩm" />
        <FormContent>
          <FormGroup>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12}>
                <FormLabel title="Mã nhóm sản phẩm" name="id" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ControllerTextField name="id" disabled control={control} />
              </Grid>
              <Grid item xs={12}>
                <FormLabel required title="Tên nhóm sản phẩm" name="name" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ControllerTextField disabled name="name" control={control} />
              </Grid>
              <Grid item xs={12}>
                <FormLabel title="Ghi chú" name="description" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ControllerTextarea
                  maxRows={5}
                  minRows={5}
                  name="description"
                  control={control}
                  disabled
                />
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>
        <FormFooter>
          <LinkButton to="/hk_group/product/type/product_group">
            Quay lại
          </LinkButton>

          <Button variant="contained" onClick={handleOpenUpdateDialog}>
            Chỉnh sửa thông tin
          </Button>
        </FormFooter>
      </FormPaperGrid>
      <FormDialog
        currentID={productGroup?.id}
        data={productGroup}
        open={openFormDialog}
        handleClose={handleCloseUpdateDialog}
      />
    </PageWrapper>
  );
};

export default DetailsForm;
