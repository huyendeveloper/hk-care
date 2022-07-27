import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Dialog, Grid } from '@mui/material';
import {
  ControllerMultiFile,
  ControllerTextarea,
  ControllerTextField,
  FormContent,
  FormFooter,
  FormGroup,
  FormHeader,
  FormLabel,
  FormPaperGrid,
} from 'components/Form';
import ControllerSwitch from 'components/Form/ControllerSwitch';
import { typeStringNumber } from 'constants/typeInput';
import { useNotification } from 'hooks';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import service from '../service';
import * as yup from 'yup';
import { AttachmentsFile, SalePointDto } from '../dto/salePointDto';

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
    // @ts-ignore
    .trimCustom('Vui lòng nhập tên điểm bán.')
    .max(150, 'Tên điểm bán không quá 150 ký tự.')
    .matches(/^HK\s+.*$/, 'Điểm bán không đúng định dạng.')
    .strict(true)
    .default(''),
  hotline: yup
    .string()
    .required('Vui lòng nhập hotline.')
    .strict(true)
    .default(''),
  address: yup
    .string()
    .required('Vui lòng nhập địa chỉ.')
    .max(150, 'Địa chỉ không quá 150 ký tự.')
    .default(''),
  status: yup.boolean().default(true),
});

const FormDialog = ({
  open,
  handleClose,
  currentID,
  disable,
  fetchTable,
}: Props) => {
  const setNotification = useNotification();
  const [files, setFiles] = useState<File[] | object[]>([]);
  const [disabled, setDisabled] = useState<boolean>(disable);

  const { control, handleSubmit, setValue, reset } = useForm<SalePointDto>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  useEffect(() => {
    setDisabled(disable);
  }, [disable, open]);

  const status = useWatch({ control, name: 'status' });

  const [loadding, setloadding] = useState<boolean>(false);
  const fetchData = async () => {
    setFiles([]);
    const data = async () => await service.detail(currentID);
    data()
      .then((rel) => {
        reset(rel);
        // eslint-disable-next-line no-labels
        var fileName = rel.attachments.map((m) => {
          return { name: m.url };
        });
        if (fileName.length) {
          setFiles(fileName);
        } else {
          setFiles([]);
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (currentID && open) {
      reset({ status: true });
      fetchData();
    } else {
      reset({ status: true });
      setFiles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentID, open]);

  const onSubmit = async (tenant: SalePointDto) => {
    setloadding(true);
    var filesConvert: AttachmentsFile[] = [];
    files.forEach((m: File | object | any) => {
      if (m instanceof File && m !== null && m !== undefined) {
        filesConvert = [...filesConvert, { url: '', file: m }];
      } else if (typeof m === 'object' && m !== null && m !== undefined) {
        filesConvert = [
          ...filesConvert,
          { url: m.name as string, file: undefined },
        ];
      }
    });

    tenant.attachments = filesConvert;
    if (currentID) {
      const data = await service.update(currentID, tenant);
      setloadding(false);
      if (data.status >= 500) {
        setNotification({
          message: 'Không thể gửi dữ liệu.',
          severity: 'error',
        });
      } else if (data.status !== 200) {
        setNotification({ message: data.data, severity: 'error' });
      } else {
        setNotification({ message: data.data, severity: 'success' });
        handleClose();
        fetchTable();
      }
    } else {
      const data = await service.create(tenant);
      setloadding(false);
      if (data.status >= 500) {
        setNotification({
          message: 'Không thể gửi dữ liệu.',
          severity: 'error',
        });
      } else if (data.status !== 200) {
        setNotification({ message: data.data, severity: 'error' });
      } else {
        setNotification({ message: data.data, severity: 'success' });
        handleClose();
        fetchTable();
      }
    }
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={() => handleClose()}>
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
                      title="Trạng thái hoạt động"
                      name="bussinessLicense"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ControllerSwitch
                      name="status"
                      label={status ? 'Hoạt động' : 'Không hoạt động'}
                      control={control}
                      disabled={disabled}
                    />
                  </Grid>
                </Box>
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
                    <ControllerMultiFile
                      files={files}
                      max={6}
                      setFiles={setFiles}
                      viewOnly={disabled}
                    />
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}></Grid>
            </Grid>
          </FormGroup>
        </FormContent>

        <FormFooter>
          <Button variant="outlined" onClick={() => handleClose()}>
            {disabled ? 'Đóng' : 'Hủy'}
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
    </Dialog>
  );
};

export default FormDialog;
