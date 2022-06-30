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
import { FormLabel } from 'components/Form';
import ControllerTextField from 'components/Form/ControllerTextField';
import EntitySelecter from 'components/Form/EntitySelecter';
import FormGroup from 'components/Form/FormGroup';
import useNotification from 'hooks/useNotification';
import { ILogin, ITenant } from 'interface';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from 'redux/slices';
import { AppDispatch, RootState } from 'redux/store';
import tenantService from 'services/tenant.service';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  __tenant: yup
    .string()
    .strict(true)
    .required('Vui lòng chọn điểm bán.')
    .nullable()
    .default(null),
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
  const { loading } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [tenantList, setTenantList] = useState<ITenant[]>([]);
  const [loadingTenant, setLoadingTenant] = useState<boolean>(true);

  const { control, handleSubmit } = useForm<ILogin>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  useEffect(() => {
    tenantService
      .getAll()
      .then(({ data }) => {
        setTenantList(data);
        setLoadingTenant(false);
      })
      .catch((e) => {
        setLoadingTenant(false);
      });
  }, []);

  const onSubmit = async (data: ILogin) => {
    // @ts-ignore
    const { error } = await dispatch(
      login({
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
                <FormLabel required title="Điểm bán" name="__tenant" />
                <EntitySelecter
                  name="__tenant"
                  required
                  control={control}
                  options={tenantList}
                  renderLabel={(field) => field.name}
                  placeholder=""
                  noOptionsText="Không tìm thấy điểm bán"
                  loading={loadingTenant}
                />
              </FormGroup>
              <FormGroup fullWidth>
                <FormLabel required title="Tên đăng nhập" name="username" />
                <ControllerTextField
                  name="username"
                  control={control}
                  // label="Tên đăng nhập"
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
                  // label="Mật khẩu"
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
                loading={loading}
                loadingPosition="start"
                fullWidth
                type="submit"
                sx={{ mt: 3, mb: 1.5 }}
                startIcon={<></>}
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
