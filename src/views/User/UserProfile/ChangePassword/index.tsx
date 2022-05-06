import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Grid';
import LinkButton from 'components/common/LinkButton';
import Page from 'components/common/Page';
import ControllerTextField from 'components/Form/ControllerTextField';
import FormContent from 'components/Form/FormContent';
import FormFooter from 'components/Form/FormFooter';
import FormGrid from 'components/Form/FormGrid';
import FormGroup from 'components/Form/FormGroup';
import FormHeader from 'components/Form/FormHeader';
import FormLabel from 'components/Form/FormLabel';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .required('Required')
    .trim('Cannot include leading and trailing spaces')
    .strict(true)
    .default(''),
  newPassword: yup
    .string()
    .required('Required')
    .trim('Cannot include leading and trailing spaces')
    .strict(true)
    .default(''),
  retypeNewPassword: yup
    .string()
    .required('Required')
    .trim('Cannot include leading and trailing spaces')
    .default('')
    .oneOf([yup.ref('newPassword')], "Password does not match"),
});

interface FormData {
  oldPassword: string;
  newPassword: string;
  retypeNewPassword: string;
}

const ChangePassword = () => {

  const {
    control,
    handleSubmit,
    watch,
    trigger,
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (data: FormData) => {
    console.log("Change password", data);
  };

  const [newPassword, retypeNewPassword] = watch([
    'newPassword',
    'retypeNewPassword',
  ]);
  useEffect(() => {
    if (newPassword && retypeNewPassword) {
      trigger('retypeNewPassword');
    }
  }, [trigger, newPassword, retypeNewPassword]);

  return (
    <Page title="User | Change password">
      <FormGrid noValidate onSubmit={handleSubmit(onSubmit)}>
        <FormHeader title="Change password" />
        <FormContent>
          <FormGroup>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} sm={4} md={2}>
                <FormLabel
                  required
                  title="Old password"
                  name="oldPassword"
                />
              </Grid>
              <Grid item xs={12} sm={8} md={4}>
                <ControllerTextField
                  name="oldPassword"
                  control={control}
                  type="password"
                />
              </Grid>
            </Grid>
          </FormGroup>
          <FormGroup>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} sm={4} md={2}>
                <FormLabel
                  required
                  title="New password"
                  name="newPassword"
                />
              </Grid>
              <Grid item xs={12} sm={8} md={4}>
                <ControllerTextField
                  name="newPassword"
                  control={control}
                  type="password"
                />
              </Grid>
            </Grid>
          </FormGroup>
          <FormGroup>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} sm={4} md={2}>
                <FormLabel
                  required
                  title="Retype new password"
                  name="retypeNewPassword"
                />
              </Grid>
              <Grid item xs={12} sm={8} md={4}>
                <ControllerTextField
                  name="retypeNewPassword"
                  control={control}
                  type="password"
                />
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>
        <FormFooter>
          <LinkButton startIcon={<ArrowBackIcon />} to="/dashboard">
            Back to dashboard
          </LinkButton>
          <LoadingButton
            loading={false}
            startIcon={<SaveIcon />}
            loadingPosition="start"
            type="submit"
          >
            Change password
          </LoadingButton>
        </FormFooter>
      </FormGrid>
    </Page>
  );
};

export default ChangePassword;
