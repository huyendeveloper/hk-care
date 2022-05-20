import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Dialog,
  Grid,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Stack,
} from '@mui/material';
import {
  ControllerDatePicker,
  ControllerTextarea,
  ControllerTextField,
  FormContent,
  FormFooter,
  FormGroup,
  FormHeader,
  FormLabel,
  FormPaperGrid,
} from 'components/Form';
import { IProduct } from 'interface';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import EntitySelecter from 'components/Form/EntitySelecter';
import { mockSelectFieldOptions } from 'mock-axios';
import cropConfig from 'constants/cropConfig';

interface Props {
  open: boolean;
  handleClose: (updated?: boolean) => void;
  currentID?: number | null;
  data?: IProduct;
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Required').strict(true).default(''),
  description: yup.string().strict(true).default(''),
});

const FormDialog = ({ open, handleClose, currentID, data }: Props) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const [images, setImages] = React.useState({});

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<IProduct>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (payload: IProduct) => {
    try {
      // if (payload.id) {
      //   await measureService.update(payload);
      // } else {
      //   await measureService.create(payload);
      // }
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
      setValue('group', data?.group || '');
      setValue('priceBuy', data?.priceBuy || 0);
      setValue('priceSale', data?.priceSale || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentID]);

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={() => handleClose()}>
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader
          title={
            currentID ? 'Chỉnh sửa thông tin sản phẩm' : 'Thêm mới sản phẩm'
          }
        />
        <FormContent>
          <FormGroup>
            <Grid container spacing={2}>
              {currentID && (
                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="Mã sản phẩm" name="id" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField name="id" disabled control={control} />
                  </Grid>
                </Grid>
              )}
              {!mobile && !currentID && <Grid item xs={12} md={6}></Grid>}
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel required title="Tên sản phẩm" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="name" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel required title="Nhóm sản phẩm" name="priceBuy" />
                </Grid>
                <Grid item xs={12}>
                  <EntitySelecter
                    name="priceBuy"
                    control={control}
                    options={mockSelectFieldOptions}
                    renderLabel={(field) => field.name}
                    placeholder=""
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Số đăng ký" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="name" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel required title="Nhóm điều trị" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <EntitySelecter
                    name="priceBuy"
                    control={control}
                    options={mockSelectFieldOptions}
                    renderLabel={(field) => field.name}
                    placeholder=""
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Số lô" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="name" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel required title="Dạng dùng" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <EntitySelecter
                    name="priceBuy"
                    control={control}
                    options={mockSelectFieldOptions}
                    renderLabel={(field) => field.name}
                    placeholder=""
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Hạn sử dụng" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerDatePicker
                    name="date"
                    control={control}
                    errors={errors}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <FormLabel required title="Đơn vị" name="name" />
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <ControllerTextField name="name" control={control} />
                  </Grid>
                  <Grid item xs={2}>
                    <ControllerTextField name="name" control={control} />
                  </Grid>
                  <Grid item xs={2}>
                    <ControllerTextField name="name" control={control} />
                  </Grid>
                  <Grid item xs={2}>
                    <ControllerTextField name="name" control={control} />
                  </Grid>
                  <Grid item xs={2}>
                    <ControllerTextField name="name" control={control} />
                  </Grid>
                  <Grid item xs={2}>
                    <ControllerTextField name="name" control={control} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Nhà sản xuất" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="name" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Ngày sản xuất" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerDatePicker
                    name="date"
                    control={control}
                    errors={errors}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Giá nhập" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="name" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Giá bán" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="name" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <FormLabel title="Nhà cung cấp" name="name" />
                </Grid>
                <Stack flexDirection={'row'}>
                  <Box sx={{ width: '100%' }}>
                    <EntitySelecter
                      name="priceBuy"
                      control={control}
                      options={mockSelectFieldOptions}
                      renderLabel={(field) => field.name}
                      placeholder=""
                    />
                  </Box>
                  <IconButton sx={{ ml: 1 }}>
                    <AddIcon />
                  </IconButton>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <FormLabel title="Quy cách đóng gói" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="name" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <FormLabel title="Hoạt chất" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="name" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <FormLabel required title="Hàm lượng" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="name" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <FormLabel required title="Liều dùng" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="name" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Hình ảnh sản phẩm" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField
                    type="file"
                    name="name"
                    control={control}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Ghi chú" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextarea
                    maxRows={5}
                    minRows={5}
                    name="name"
                    control={control}
                  />
                </Grid>
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
