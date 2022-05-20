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
import EntitySelecter from 'components/Form/EntitySelecter';
import FormGroup from 'components/Form/FormGroup';
import useMounted from 'hooks/useMounted';
import useNotification from 'hooks/useNotification';
import { ILogin, ITenant } from 'interface';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from 'redux/slices';
import { AppDispatch } from 'redux/store';
import tenantService from 'services/tenant.service';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  __tenant: yup
    .string()
    // .trim('Cannot include leading and trailing spaces')
    .strict(true)
    .required('Required')
    .nullable()
    .default(null),
  username: yup
    .string()
    // .trim('Cannot include leading and trailing spaces')
    .strict(true)
    // .email('Email is invalid')
    .required('Vui lòng điền tên đăng nhập.')
    .default(''),
  password: yup
    .string()
    // .trim('Cannot include leading and trailing spaces')
    .strict(true)
    .required('Vui lòng điền mật khẩu.')
    .default(''),
});

const Login = () => {
  const setNotification = useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const isMounted = useMounted();
  const navigate = useNavigate();
  const [tenantList, setTenantList] = useState<ITenant[]>([]);

  const { control, handleSubmit } = useForm<ILogin>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  useEffect(() => {
    tenantService.getAll().then(({ data }) => {
      setTenantList(data);
    });
  }, []);

  const onSubmit = async (data: ILogin) => {
    try {
      setLoading(true);
      const { type } = await dispatch(login(data));

      if (type.includes('fulfilled')) {
        return navigate('/');
      }

      if (type.includes('rejected')) {
        setNotification({
          error: 'Tên đăng nhập hoặc mật khẩu sai!',
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
                <EntitySelecter
                  name="__tenant"
                  required
                  control={control}
                  options={tenantList}
                  renderLabel={(field) => field.name}
                  placeholder=""
                  label="Điểm bán"
                />
              </FormGroup>
              <FormGroup fullWidth>
                <ControllerTextField
                  name="username"
                  control={control}
                  label="Tên đăng nhập"
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
