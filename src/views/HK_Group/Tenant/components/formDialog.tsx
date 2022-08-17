import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
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
import ControllerMultiPdfs from 'components/Form/ControllerMultiPdfs';
import { typeStringNumber } from 'constants/typeInput';
import { create } from 'domain';
import { useNotification } from 'hooks';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { createSalePoint } from 'redux/slices/tenant';
import importReceiptService from 'services/importReceipt.service';
import salePointService from 'services/salePoint.service';
import * as yup from 'yup';
import { SalePointDto } from '../dto/salePointDto';

const randexp = require('randexp').randexp;

interface Props {
  open: boolean;
  handleClose: (updated?: boolean) => void;
  currentID?: string | null;
  data?: SalePointDto;
  disable: boolean;
  fetchTable: () => void;
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
    .required('Vui lòng nhập tên điểm bán.')
    .max(150, 'Tên điểm bán không quá 150 ký tự.')
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^(HK)[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s_,.\-]+$/,
      'Điểm bán không đúng định dạng.'
    )
    .strict(true)
    .default('John Doe'),
  hotline: yup
    .string()
    .max(15, '')
    .required('Vui lòng nhập hotline.')
    .matches(
      /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9]{10,15})+$/,
      'Số điện thoại không đúng định dạng.'
    )
    .strict(true),
  address: yup
    .string()
    .required('Vui lòng nhập địa chỉ')
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s_,.\-]+$/,
      'Địa chỉ không đúng định dạng hoặc chứa ký tự đặc biệt.'
    )
    .max(150, 'Địa chỉ không quá 150 ký tự.'),
  status: yup.boolean().default(true),
  adminEmailAddress: yup
    .string()
    .required('Vui lòng nhập tên đăng nhập.')
    .email('Không đúng định dạng email.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập tên đăng nhập.'),
  adminPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập mật khẩu.')
    .default(
      randexp(
        /^(Hk)@(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/
      )
    ),
});

const FormDialog = ({
  open,
  handleClose,
  currentID,
  disable,
  fetchTable,
}: Props) => {
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [loadding, setloadding] = useState<boolean>(false);
  const [files, setFiles] = useState<File[] | object[]>([]);
  const [disabled, setDisabled] = useState<boolean>(disable);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [loaddingInit, setloaddingInit] = useState<boolean>(false);

  const { control, handleSubmit, setValue, reset } = useForm<SalePointDto>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const fetchData = async () => {
    setloaddingInit(true);
    setFiles([]);
    const data = async () => await salePointService.detail(currentID);
    data()
      .then((rel) => {
        reset(rel);
        setloaddingInit(false);
        setloadding(false);
        if (rel.attachments) {
          setFiles(rel.attachments);
        } else {
          setFiles([]);
        }
      })
      .catch(() => {
        setloaddingInit(false);
      });
  };

  const create = async (tenant: SalePointDto) => {
    // @ts-ignore
    const { payload, error } = await dispatch(createSalePoint(tenant));
    console.log('payload :>> ', payload);
    console.log('error :>> ', error);
    if (error) {
      setNotification({
        error: 'Lỗi!',
      });
      console.log('error :>> ', error);
      setloadding(false);

      return;
    }

    // try {
    //   // create admin account

    //   const data = await salePointService.create(tenant);
    //   setloadding(false);
    //   if (data.status >= 500) {
    //     setNotification({
    //       message: 'Không thể gửi dữ liệu.',
    //       severity: 'error',
    //     });
    //   } else if (data.status !== 200) {
    //     setloadding(false);
    //     setNotification({ message: data.data, severity: 'error' });
    //   } else {
    //     setloadding(false);
    //     setNotification({ message: data.data, severity: 'success' });
    //     handleClose();
    //     fetchTable();
    //   }
    // } catch (error: any) {
    //   setNotification({
    //     message: error.response.data.toString().replace(',', '\n'),
    //     severity: 'error',
    //   });
    //   setloadding(false);
    // }
  };

  const onSubmit = async (tenant: SalePointDto) => {
    setloadding(true);
    // @ts-ignore
    tenant.attachments = files;
    if (currentID) {
      try {
        const data = await salePointService.update(currentID, tenant);
        if (data.status >= 500) {
          setloadding(false);
          setNotification({
            message: 'Không thể gửi dữ liệu.',
            severity: 'error',
          });
        } else if (data.status !== 200) {
          setloadding(false);
          setNotification({ message: data.data, severity: 'error' });
        } else {
          setloadding(false);
          setNotification({ message: data.data, severity: 'success' });
          handleClose();
          fetchTable();
        }
      } catch (error: any) {
        setNotification({
          message: error.response.data.toString().replace(',', '\n'),
          severity: 'error',
        });
        setloadding(false);
      }
    } else {
      create(tenant);
    }
  };

  // @ts-ignore
  const handleChangeFiles = async (newValue) => {
    setShowBackdrop(true);
    setFiles(newValue);
    // @ts-ignore
    await newValue.forEach(async (file, index, array) => {
      // @ts-ignore
      if (file?.type) {
        const { data } = await importReceiptService.getPathFileReceipt(file);
        // @ts-ignore
        setFiles((prev) => {
          const newFile = [...prev];
          // @ts-ignore
          newFile[index] = { name: file?.name, url: data };
          return newFile;
        });
      }
    });
  };

  useEffect(() => {
    if (!showBackdrop) return;
    // @ts-ignore
    const fileList = files.filter((item) => Boolean(item.type));
    if (fileList.length === 0) {
      setShowBackdrop(false);
      // @ts-ignore
      setValue('attachments', files);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, showBackdrop]);

  useEffect(() => {
    setDisabled(disable);
  }, [disable, open]);

  useEffect(() => {
    if (currentID && open) {
      setloadding(false);
      reset({ isActived: true });
      fetchData();
    } else {
      setloadding(false);
      reset({
        isActived: true,
        adminPassword: randexp(
          /^(Hk)@(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/
        ),
      });
      setFiles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentID, open]);

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={() => handleClose()}>
      {loaddingInit ? (
        <Box sx={{ width: '100%', padding: '20px 10px' }}>
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </Box>
      ) : (
        <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
          <FormHeader
            title={
              disabled
                ? 'Xem thông tin điểm bán'
                : currentID
                ? 'Chỉnh sửa thông tin điểm bán'
                : 'Thêm mới điểm bán'
            }
          />
          <FormContent>
            <FormGroup>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel required title="Tên điểm bán" name="name" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField
                      name="name"
                      control={control}
                      disabled={disabled}
                      helperText={
                        <>
                          HK [ĐỊA CHỈ ĐIỂM BÁN]
                          <br />
                          VD: HK 39 Núi Trúc
                        </>
                      }
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="Người liên hệ" name="nameContact" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField
                      name="nameContact"
                      control={control}
                      disabled={disabled}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="Hotline" required name="hotline" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField
                      inputProps={typeStringNumber((value) =>
                        setValue('hotline', value)
                      )}
                      name="hotline"
                      control={control}
                      disabled={disabled}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="Di động" name="phone" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField
                      inputProps={typeStringNumber((value) =>
                        setValue('phone', value)
                      )}
                      name="phone"
                      control={control}
                      disabled={disabled}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="Địa chỉ" required name="address" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextField
                      name="address"
                      control={control}
                      disabled={disabled}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    <FormLabel title="Ghi chú" name="description" />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerTextarea
                      maxRows={5}
                      minRows={5}
                      name="description"
                      control={control}
                      disabled={disabled}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 'auto' }}>
                    <Grid item xs={12}>
                      <FormLabel
                        title="Tài liệu đính kèm"
                        name="bussinessLicense"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <ControllerMultiPdfs
                        files={files}
                        setFiles={(newValue) => {
                          handleChangeFiles(newValue);
                        }}
                        message="Tài liệu đính kèm chỉ cho phép file pdf."
                        disabled={disabled}
                      />
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}></Grid>
              </Grid>
            </FormGroup>
            <Divider sx={{ mt: 3.5, mb: 1.5 }} />
            <Typography
              color="text.secondary"
              sx={{ fontWeight: 'regular', fontSize: '1.74rem' }}
            >
              Thông tin Admin quản lý điểm bán
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel
                    title="Tên tài khoản"
                    required
                    name="adminEmailAddress"
                  />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField
                    name="adminEmailAddress"
                    control={control}
                    disabled={disabled}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Mật khẩu" required name="adminPassword" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextField
                    name="adminPassword"
                    control={control}
                    disabled={disabled}
                  />
                </Grid>
              </Grid>
            </Grid>
          </FormContent>

          <FormFooter>
            <Button variant="outlined" onClick={() => handleClose()}>
              {disabled ? 'Quay lại' : 'Hủy'}
            </Button>
            {disabled && currentID && (
              <Button onClick={() => setDisabled(false)}>
                Chỉnh sửa thông tin
              </Button>
            )}

            {!disabled && (
              <LoadingButton loading={loadding} type="submit">
                Lưu
              </LoadingButton>
            )}
          </FormFooter>
        </FormPaperGrid>
      )}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBackdrop}
        onClick={() => setShowBackdrop(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default FormDialog;
