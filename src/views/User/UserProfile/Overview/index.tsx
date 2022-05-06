import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Page from 'components/common/Page';
import ControllerTextField from 'components/Form/ControllerTextField';
import EntitySelecter from 'components/Form/EntitySelecter';
import FormGroup from 'components/Form/FormGroup';
import FormInputAdornment from 'components/Form/FormInputAdornment';
import FormLabel from 'components/Form/FormLabel';
import useAuth from 'hooks/useAuth';
import { mockRoleOptions } from 'mock-axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import Regexs from 'utils/Regexs';
import * as yup from 'yup';
import EditProfileDialog from './EditProfileDialog';

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

const Overview = () => {

  const [openEditProfileDialog, setOpenEditProfileDialog] =
    useState<boolean>(false);
  const { user: userInfo, onForceUpdate } = useAuth();

  const { control, getValues, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: validationSchema.getDefault(),

  });

  const handleOpenEditProfile = () => {
    setOpenEditProfileDialog(true);
  };

  const handleToggleEditProfile = () => {
    setOpenEditProfileDialog(!openEditProfileDialog);
  };

  //mock
  useEffect(() => {
    reset({
      roleId: 1,
      firstName: "John",
      lastName: "Smith",
      email: "johnsmith@gmail.com",
      mobileNumber: "391887289",
    })
  }, [reset])

  return (
    <Page title="User | Profile details">
      <form>

        <Box sx={{ p: 2 }}>
          <Box>
            <Typography>Profile details</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          {userInfo && (
            <Grid
              container
              alignItems="flex-start"
              justifyContent="space-between"
              spacing={2}
            >
              <Grid item xs={12} sm={4} md={2}>
                <Box sx={{ display: 'flex', pr: 1 }}>
                  <Avatar
                    alt="Logo"
                    src={userInfo.image || ''}
                    sx={{ width: 1, height: 1, aspectRatio: '1 / 1' }}
                    variant="rounded"
                  >
                    <PersonIcon fontSize="large" />
                  </Avatar>
                </Box>
              </Grid>
              <Grid item xs={12} sm={8} md={10}>
                <FormGroup>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={4} md={2}>
                      <FormLabel required title="First name" name="firstName" />
                    </Grid>
                    <Grid item xs={12} sm={8} md={4}>
                      <ControllerTextField
                        disabled
                        name="firstName"
                        control={control}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                      <FormLabel
                        required
                        title="Last name"
                        name="lastName" />
                    </Grid>
                    <Grid item xs={12} sm={8} md={4}>
                      <ControllerTextField
                        disabled
                        name="lastName"
                        control={control}
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
                <FormGroup>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={4} md={2}>
                      <FormLabel
                        required
                        title="Email"
                        name="email" />
                    </Grid>
                    <Grid item xs={12} sm={8} md={4}>
                      <ControllerTextField
                        disabled
                        name="email"
                        control={control}
                      />
                    </Grid>

                  </Grid>
                </FormGroup>
                <FormGroup>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={4} md={2}>
                      <FormLabel
                        required
                        title="Phone number"
                        name="mobileNumber"
                      />
                    </Grid>
                    <Grid item xs={12} sm={8} md={4}>
                      <ControllerTextField
                        disabled
                        name="mobileNumber"
                        control={control}
                        InputProps={{
                          startAdornment: (
                            <FormInputAdornment
                              position="start"
                              title={"+84"}
                              disabled
                              visible={!!getValues('mobileNumber')}
                            />
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
                <FormGroup>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={4} md={2}>
                      <FormLabel
                        required
                        title="Role"
                        name="roleId" />
                    </Grid>
                    <Grid item xs={12} sm={8} md={4}>
                      <EntitySelecter
                        disabled
                        name="roleId"
                        control={control}
                        options={mockRoleOptions}
                        renderLabel={(field) => field.name}
                        placeholder="Please select a field"
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </Grid>
              <EditProfileDialog
                userInfo={userInfo}
                open={openEditProfileDialog}
                onToggle={handleToggleEditProfile}
                onForceUpdate={onForceUpdate}
              />
            </Grid>
          )}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                component={RouterLink}
                to="/dashboard"
              >
                Back to dasboard
              </Button>
              <Button startIcon={<EditIcon />} onClick={handleOpenEditProfile}>
                Edit profile
              </Button>

              {/* <Button startIcon={<EditIcon />} onClick={handleOpenEdit}>
            Edit Truck
          </Button> */}
            </Stack>
          </Box>
        </Box>
      </form>
    </Page >
  );
};

export default Overview;
