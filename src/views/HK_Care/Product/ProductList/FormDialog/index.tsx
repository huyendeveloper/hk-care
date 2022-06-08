import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, Grid } from '@mui/material';
import {
  ControllerTextField,
  EntitySelecter,
  FormContent,
  FormFooter,
  FormGroup,
  FormHeader,
  FormLabel,
  FormPaperGrid
} from 'components/Form';
import { useNotification } from 'hooks';
import { IMeasure, IProductList } from 'interface';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updatePrice } from 'redux/slices/productList';
import measureService from 'services/measure.service';
import productListService from 'services/productList.service';
import * as yup from 'yup';

interface Props {
  open: boolean;
  handleClose: (updated?: boolean) => void;
  currentID?: number | null;
}

const validationSchema = yup.object().shape({});

const FormDialog = ({ open, handleClose, currentID }: Props) => {
  const setNotification = useNotification();
  const [measureList, setMeasureList] = useState<IMeasure[]>([]);
  const dispatch = useDispatch();
  const [mesureLevelFisrtName, setMesureLevelFisrtName] = useState<string>('');
  const [mesureLevelSecondName, setMesureLevelSecondName] =
    useState<string>('');
  const [mesureLevelThirdName, setMesureLevelThirdName] = useState<string>('');

  const { control, handleSubmit, setValue, reset } = useForm<IProductList>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (payload: IProductList) => {
    const { error } = await dispatch(
      // @ts-ignore
      updatePrice({ price: payload.price, productId: currentID })
    );
    if (error) {
      setNotification({ error: 'Lỗi khi cập nhật sản phẩm!' });
      return;
    }
    setNotification({
      message: 'Cập nhật thành công',
      severity: 'success',
    });

    reset();
    handleClose(true);
  };

  const fetchData = async () => {
    if (Number(currentID) > 0) {
      const { data } = await productListService.get(Number(currentID));
      setValue('productName', data.name);
      setValue('importPrice', data.importPrice);
      setValue('price', data.price);
      setValue('mesureLevelFisrt', data?.mesureLevelFisrt.id);
      setValue('mesureLevelSecond', data?.mesureLevelSecond.id);
      setValue('mesureLevelThird', data?.mesureLevelThird.id);
      setValue('amountSecond', data?.amountSecond);
      setValue('amountThird', data?.amountThird);
      setMesureLevelFisrtName(data?.mesureLevelFisrt.name);
      setMesureLevelSecondName(data?.mesureLevelSecond.name);
      setMesureLevelThirdName(data?.mesureLevelThird.name);
    }
  };

  const fetchMeasureList = () => {
    measureService
      .getAllMeasure()
      .then(({ data }) => {
        setMeasureList(data.items);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  useEffect(() => {
    fetchMeasureList();
  }, []);

  useEffect(() => {
    reset();
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentID, open]);

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={() => handleClose()}>
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader title="Sửa giá bán" />
        <FormContent>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <FormLabel required title="Tên sản phẩm" name="productName" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField
                    name="productName"
                    disabled
                    control={control}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid item xs={12}>
                  <FormLabel required title="Đơn vị" name="mesureLevelFisrt" />
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={2}>
                    <EntitySelecter
                      name="mesureLevelFisrt"
                      control={control}
                      options={measureList}
                      renderLabel={(field) => field.name}
                      noOptionsText="Không tìm thấy đơn vị đo lường"
                      placeholder="Cấp 1 *"
                      disabled
                      defaultValue={mesureLevelFisrtName}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <ControllerTextField
                      type="number"
                      name="amountSecond"
                      disabled
                      control={control}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <EntitySelecter
                      name="mesureLevelSecond"
                      control={control}
                      options={measureList}
                      renderLabel={(field) => field.name}
                      noOptionsText="Không tìm thấy đơn vị đo lường"
                      placeholder="Cấp 2"
                      disabled
                      defaultValue={mesureLevelSecondName}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <ControllerTextField
                      name="amountThird"
                      disabled
                      control={control}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <EntitySelecter
                      name="mesureLevelThird"
                      control={control}
                      options={measureList}
                      renderLabel={(field) => field.name}
                      noOptionsText="Không tìm thấy đơn vị đo lường"
                      placeholder="Cấp 3"
                      disabled
                      defaultValue={mesureLevelThirdName}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}></Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Giá nhập" name="importPrice" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField
                    name="importPrice"
                    disabled
                    control={control}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Giá bán" name="price" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField name="price" control={control} />
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
