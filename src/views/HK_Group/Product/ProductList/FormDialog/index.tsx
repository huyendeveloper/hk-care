import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ControllerDatePicker,
  ControllerImageField,
  ControllerTextarea,
  ControllerTextField,
  FormContent,
  FormFooter,
  FormGroup,
  FormHeader,
  FormLabel,
  FormPaperGrid,
} from 'components/Form';
import EntitySelecter from 'components/Form/EntitySelecter';
import { defaultFilters } from 'constants/defaultFilters';
import { typeNumber } from 'constants/typeInput';
import { IProduct, IProductGroup, ITreatmentGroup, IUsage } from 'interface';
import { mockSelectFieldOptions } from 'mock-axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import productGroupService from 'services/productGroup.service';
import treatmentGroupService from 'services/treatmentGroup.service';
import usageService from 'services/usage.service';
import { FilterParams } from 'types';
import * as yup from 'yup';

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
  const [image, setImage] = useState<Blob | null | undefined>();
  const [productGroupList, setProductGroupList] = useState<IProductGroup[]>([]);
  const [treatmentGroupList, setTreatmentGroupList] = useState<
    ITreatmentGroup[]
  >([]);
  const [usageList, setUsageList] = useState<IUsage[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm<IProduct>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (payload: IProduct) => {
    try {
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
  }, [currentID]);

  const fetchProductGroupList = (value: string) => {
    const filters: FilterParams = {
      ...defaultFilters,
      searchText: value,
    };

    productGroupService
      .getAll(filters)
      .then(({ data }) => {
        setProductGroupList(data.items);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  const fetchTreatmentGroupList = (value: string) => {
    const filters: FilterParams = {
      ...defaultFilters,
      searchText: value,
    };

    treatmentGroupService
      .getAll(filters)
      .then(({ data }) => {
        setTreatmentGroupList(data.items);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  const fetchUsageList = (value: string) => {
    const filters: FilterParams = {
      ...defaultFilters,
      searchText: value,
    };

    usageService
      .getAll(filters)
      .then(({ data }) => {
        setUsageList(data.items);
      })
      .catch((err) => {})
      .finally(() => {});
  };

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
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel required title="Tên sản phẩm" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="name" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}></Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel
                    required
                    title="Nhóm sản phẩm"
                    name="productGroup"
                  />
                </Grid>
                <Grid item xs={12}>
                  <EntitySelecter
                    name="productGroup"
                    control={control}
                    options={productGroupList}
                    renderLabel={(field) => field.name}
                    handleChangeInput={fetchProductGroupList}
                    placeholder=""
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Số đăng ký" name="phone" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="phone" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel required title="Nhóm điều trị" name="phone" />
                </Grid>
                <Grid item xs={12}>
                  <EntitySelecter
                    name="treatmentGroup"
                    control={control}
                    options={treatmentGroupList}
                    renderLabel={(field) => field.name}
                    handleChangeInput={fetchTreatmentGroupList}
                    placeholder=""
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Số lô" name="phone" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="phone" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel required title="Dạng dùng" name="phone" />
                </Grid>
                <Grid item xs={12}>
                  <EntitySelecter
                    name="usage"
                    control={control}
                    options={usageList}
                    renderLabel={(field) => field.name}
                    handleChangeInput={fetchUsageList}
                    placeholder=""
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Hạn sử dụng" name="phone" />
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
                  <FormLabel required title="Đơn vị" name="phone" />
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <ControllerTextField name="phone" control={control} />
                  </Grid>
                  <Grid item xs={2}>
                    <ControllerTextField name="phone" control={control} />
                  </Grid>
                  <Grid item xs={2}>
                    <ControllerTextField name="phone" control={control} />
                  </Grid>
                  <Grid item xs={2}>
                    <ControllerTextField name="phone" control={control} />
                  </Grid>
                  <Grid item xs={2}>
                    <ControllerTextField name="phone" control={control} />
                  </Grid>
                  <Grid item xs={2}>
                    <ControllerTextField name="phone" control={control} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Nhà sản xuất" name="phone" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="phone" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Ngày sản xuất" name="phone" />
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
                  <FormLabel title="Giá nhập" name="phone" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="phone" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Giá bán" name="phone" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="phone" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <FormLabel title="Nhà cung cấp" name="phone" />
                </Grid>
                <Stack flexDirection={'row'}>
                  <Box sx={{ width: '100%' }}>
                    <EntitySelecter
                      name="usage"
                      control={control}
                      options={usageList}
                      renderLabel={(field) => field.name}
                      handleChangeInput={fetchUsageList}
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
                  <FormLabel title="Quy cách đóng gói" name="phone" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="phone" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <FormLabel title="Hoạt chất" name="phone" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="phone" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <FormLabel required title="Hàm lượng" name="phone" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="phone" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <FormLabel required title="Liều dùng" name="phone" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="phone" control={control} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Hình ảnh sản phẩm" name="phone" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerImageField image={image} setImage={setImage} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Ghi chú" name="phone" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextarea
                    maxRows={11}
                    minRows={11}
                    name="phone"
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
