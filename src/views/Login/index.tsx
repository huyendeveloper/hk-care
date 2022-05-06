import { yupResolver } from '@hookform/resolvers/yup';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Page from 'components/common/Page';
import RouteLink from 'components/common/RouteLink';
import ControllerTextField from 'components/Form/ControllerTextField';
import FormGroup from 'components/Form/FormGroup';
import useAuth from 'hooks/useAuth';
import useMounted from 'hooks/useMounted';
import useNotification from 'hooks/useNotification';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoginParams } from 'services/auth';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .trim('Cannot include leading and trailing spaces')
    .strict(true)
    // .email('Email is invalid')
    .required('Required')
    .default(''),
  password: yup
    .string()
    .trim('Cannot include leading and trailing spaces')
    .strict(true)
    .required('Required')
    .default(''),
});

const Login = () => {
  const setNotification = useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const isMounted = useMounted();

  const { control, handleSubmit } = useForm<LoginParams>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (data: LoginParams) => {
    try {
      setLoading(true);
      const response = await login(data);
      if (!response.success) {
        setNotification({
          error: 'Login failure',
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  return (
    <Page title="Transpora | Login">
      <Grid container sx={{ height: 1 }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          lg={8}
          sx={{
            backgroundImage: 'url(/static/register.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h3" align="center">
              Transpora
            </Typography>
            <Typography align="center" variant="body2" sx={{ my: 3 }}>
              Log in with your user Email-Adress and your password
            </Typography>
            <FormGroup fullWidth>
              <ControllerTextField
                name="username"
                control={control}
                label="Email"
                placeholder="Email"
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormGroup>
            <FormGroup fullWidth>
              <ControllerTextField
                name="password"
                control={control}
                type="password"
                label="Password"
                required
                fullWidth
                placeholder="Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormGroup>
            <LoadingButton
              loading={loading}
              loadingPosition="start"
              fullWidth
              type="submit"
              sx={{ mt: 3, mb: 1.5 }}
              startIcon={<LoginIcon />}
            >
              Login
            </LoadingButton>
            <Divider sx={{ my: 3 }} />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <RouteLink to="/forgot-password" variant="body2" gutterBottom>
                Forgot password
              </RouteLink>
              <RouteLink to="/register" variant="body2">
                Create new account
              </RouteLink>
            </Box>
          </Form>
        </Grid>
      </Grid>
    </Page>
  );
};

const Form = styled('form')(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: theme.spacing(10),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

export default Login;
