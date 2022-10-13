import { yupResolver } from '@hookform/resolvers/yup';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import Page from 'components/common/Page';
import ControllerTextField from 'components/Form/ControllerTextField';
import EntitySelecter from 'components/Form/EntitySelecter';
import FormGroup from 'components/Form/FormGroup';
import FormLabel from 'components/Form/FormLabel';
import useNotification from 'hooks/useNotification';
import { ILogin, ITenant } from 'interface';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { connectToken, resetLoading } from 'redux/slices/auth';
import { getTenants } from 'redux/slices/tenant';
import { RootState } from 'redux/store';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  // __tenant: yup
  //   .string()
  //   .strict(true)
  //   .required('Vui lòng chọn điểm bán.')
  //   .typeError('Vui lòng chọn điểm bán.'),
  username: yup
    .string()
    .strict(true)
    .required('Vui lòng điền tên đăng nhập.')
    .default(''),
  password: yup
    .string()
    .strict(true)
    .required('Vui lòng điền mật khẩu.')
    .default(''),
});

const Login = () => {
  const setNotification = useNotification();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading: loadingTenants } = useSelector(
    (state: RootState) => state.tenant
  );
  const { loading: loadingLogin } = useSelector(
    (state: RootState) => state.auth
  );

  const loadingInit = async () => {
    await dispatch(resetLoading());
  };

  useEffect(() => {
    loadingInit();
  }, []);

  const [tenantList, setTenantList] = useState<ITenant[]>([]);

  const { control, handleSubmit } = useForm<ILogin>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const fetchTenants = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getTenants());
    if (error) {
      setNotification({ error: 'Hệ thống đang gặp sự cố' });
      return;
    }
    setTenantList(payload.tenants);
  };

  useEffect(() => {
    fetchTenants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: ILogin) => {
    const { error } = await dispatch(
      // @ts-ignore
      connectToken({
        ...data,
        tenant: tenantList.find((x) => x.id === data.__tenant)?.name || '',
      })
    );

    if (error) {
      setNotification({
        error: 'Vui lòng kiểm tra lại thông tin đăng nhập.',
      });
      return;
    }

    return navigate('/');
  };

  return (
    <Page title="Đăng nhập">
      <Grid container sx={{ height: 1 }}>
        <Grid
          item
          xs={0}
          sm={12}
          md={12}
          lg={12}
          sx={{
            background: '#137b3e',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
          }}
        >
          <Grid
            item
            xs={12}
            sm={8}
            md={6}
            lg={4}
            sx={{ backgroundColor: 'white', marginX: 'auto', marginY: 'auto' }}
          >
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Box
                component="img"
                sx={{
                  width: '60%',
                  mb: 7,
                }}
                alt="hk care logo"
                src="/static/logo.png"
              />
              <FormGroup fullWidth>
                <FormLabel title="Điểm bán" name="__tenant" />
                <EntitySelecter
                  name="__tenant"
                  required
                  control={control}
                  options={tenantList}
                  renderLabel={(field) => field.name}
                  placeholder=""
                  noOptionsText="Không tìm thấy điểm bán"
                  loading={loadingTenants}
                />
              </FormGroup>
              <FormGroup fullWidth>
                <FormLabel required title="Tên đăng nhập" name="username" />
                <ControllerTextField
                  name="username"
                  control={control}
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
                <FormLabel required title="Mật khẩu" name="password" />
                <ControllerTextField
                  name="password"
                  control={control}
                  type="password"
                  required
                  fullWidth
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
                loading={loadingLogin}
                loadingPosition="start"
                fullWidth
                type="submit"
                sx={{ mt: 3, mb: 1.5 }}
                startIcon={<></>}
              >
                Đăng nhập
              </LoadingButton>
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
