import { yupResolver } from '@hookform/resolvers/yup';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import Page from 'components/common/Page';
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
    // .trim('Cannot include leading and trailing spaces')
    .strict(true)
    // .email('Email is invalid')
    .required('Điền tên đăng nhập để đăng nhập')
    .default(''),
  password: yup
    .string()
    // .trim('Cannot include leading and trailing spaces')
    .strict(true)
    .required('Điền mật khẩu để đăng nhập')
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
          error: 'Tên đăng nhập hoặc mật khẩu sai',
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
    <Page title="HK Care | Login">
      <Grid
        container
        sx={{
          height: 1,
          backgroundColor: '#137b3e',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={7}
          sx={{
            backgroundColor: '#ffffff',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Grid item xs={8}>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Box
                component="img"
                sx={{
                  width: '60%',
                  mb: 3,
                }}
                alt="hk care logo"
                src="/static/logo.png"
              />

              <FormGroup fullWidth>
                <ControllerTextField
                  name="username"
                  control={control}
                  label="Tên đăng nhập"
                  // placeholder="Email"
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
                  label="Mật khẩu"
                  required
                  fullWidth
                  // placeholder="Password"
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
                fullWidth
                type="submit"
                sx={{ mt: 3, mb: 1.5 }}
              >
                Đăng nhập
              </LoadingButton>
              <Divider sx={{ my: 3 }} />
            </Form>
          </Grid>
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
