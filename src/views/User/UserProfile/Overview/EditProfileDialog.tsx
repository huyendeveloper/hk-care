import { yupResolver } from '@hookform/resolvers/yup';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CropImageDialog from 'components/common/CropImageDialog';
import ImagePlaceHolder from 'components/common/ImagePlaceHolder';
import LogoDropzone from 'components/common/LogoDropzone';
import ControllerTextField from 'components/Form/ControllerTextField';
import EntitySelecter from 'components/Form/EntitySelecter';
import FormGroup from 'components/Form/FormGroup';
import FormInputAdornment from 'components/Form/FormInputAdornment';
import FormLabel from 'components/Form/FormLabel';
import { mockRoleOptions } from 'mock-axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserInfo } from 'types';
import Regexs from 'utils/Regexs';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim('Cannot include leading and trailing spaces')
    .strict(true)
    .required('Required')
    .default(''),
  lastName: yup
    .string()
    .trim('Cannot include leading and trailing spaces')
    .strict(true)
    .required('Required')
    .default(''),
  email: yup
    .string()
    .trim('Cannot include leading and trailing spaces')
    .strict(true)
    .required('Required')
    .default(''),
  mobileNumber: yup
    .string()
    .required('Required')
    .matches(Regexs.phone, 'yupErrorMessage.onlyNumber')
    .default(''),
  roleId: yup.number().required('Required').nullable().default(null),
});

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  roleId: number | null;
}

interface Props {
  open: boolean;
  onToggle: () => void;
  userInfo: UserInfo;
  onForceUpdate: () => void;
}

const EditProfileDialog = (props: Props) => {
  const { open, onToggle, userInfo } = props;
  const [logo, setLogo] = useState<File | null>(null);
  const [openCropImage, setOpenCropImage] = useState<boolean>(false);
  const [logoBase64, setLogoBase64] = useState<string>('');

  const { control, handleSubmit, reset } = useForm<FormData>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  // reset logo
  useEffect(() => {
    setLogo(null);
  }, [open]);

  //call api or pass profile data to EditComponent
  useEffect(() => {
    reset({
      roleId: 1,
      firstName: "John",
      lastName: "Smith",
      email: "johnsmith@gmail.com",
      mobileNumber: "391887289",
    })
  }, [reset])

  const onSubmit = async (data: FormData) => {
    //upload image: depend Backend (use base64)
    console.log("update profile", data);
  };

  const handleDropCover = async ([file]: File[]) => {
    const logoPreview = URL.createObjectURL(file);
    setLogoBase64(logoPreview);
    setLogo(file);
    setOpenCropImage(true);
  };

  const closeCropImage = () => {
    setOpenCropImage(false);
  };

  const saveLogoCrop = (base64: string) => {
    setLogoBase64(base64);
  };

  const cancelCropImage = () => {
    setLogoBase64(userInfo.image || '');
    setLogo(null);
  };

  return (
    <Dialog open={open} onClose={onToggle} scroll="body" fullWidth>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        <PersonIcon sx={{ fontSize: 70, color: 'text.secondary' }} />
        <Typography sx={{ mt: 1 }} variant="h6" color="text.secondary">
          Change profile details
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ bgcolor: '#f8fafb' }}>
          <FormGroup>
            <Grid container alignItems="center" columnSpacing={2}>
              <Grid item xs={4}>
                <FormLabel
                  required
                  title="First name"
                  name="firstName" />
              </Grid>
              <Grid item xs={8}>
                <ControllerTextField
                  name="firstName"
                  control={control}
                />
              </Grid>
            </Grid>
          </FormGroup>
          <FormGroup>
            <Grid container alignItems="center" columnSpacing={2}>
              <Grid item xs={4}>
                <FormLabel
                  required
                  title="Last name"
                  name="lastName" />
              </Grid>
              <Grid item xs={8}>
                <ControllerTextField
                  name="lastName"
                  control={control}
                />
              </Grid>
            </Grid>
          </FormGroup>
          <FormGroup>
            <Grid container alignItems="center" columnSpacing={2}>
              <Grid item xs={4}>
                <FormLabel
                  required
                  title="Phone number"
                  name="mobileNumber"
                />
              </Grid>
              <Grid item xs={8}>
                <ControllerTextField
                  name="mobileNumber"
                  control={control}
                  InputProps={{
                    startAdornment: (
                      <FormInputAdornment
                        position="start"
                        title={"+84"}
                      />
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </FormGroup>

          <FormGroup>
            <Grid container alignItems="center" columnSpacing={2}>
              <Grid item xs={4}>
                <FormLabel
                  required
                  title="Role"
                  name="roleId"
                />
              </Grid>
              <Grid item xs={8}>
                <EntitySelecter
                  name="roleId"
                  control={control}
                  options={mockRoleOptions}
                  renderLabel={(field) => field.name}
                  placeholder="Please select a field"
                />
              </Grid>
            </Grid>
          </FormGroup>
          <FormGroup>
            <Grid container alignItems="start" spacing={2}>
              <Grid item xs={12} sm={4} md={4} sx={{ mt: 1 }}>
                <FormLabel title="Logo" name="logo" />
              </Grid>
              <Grid item xs={12} sm={8} md={8}>
                <Box sx={{ display: 'flex' }}>
                  <ImagePlaceHolder src={logoBase64} />
                  <LogoDropzone
                    accept="image/*"
                    maxFiles={1}
                    onDrop={handleDropCover}
                  />
                </Box>
              </Grid>
            </Grid>
          </FormGroup>
        </DialogContent>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 2 }}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={onToggle}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={false}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              type="submit"
            >
              Save profile
            </LoadingButton>
          </Stack>
        </Box>
      </form>
      <CropImageDialog
        image={logo}
        open={openCropImage}
        onClose={closeCropImage}
        onCancel={cancelCropImage} //don't save crop image
        onSave={saveLogoCrop}
      />
    </Dialog>
  );
};

export default EditProfileDialog;
