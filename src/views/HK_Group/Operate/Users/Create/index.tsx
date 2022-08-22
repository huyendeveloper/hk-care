import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Divider, FormGroup, Grid } from '@mui/material';

import { LinkButton, LoadingScreen, PageWrapper } from 'components/common';
import {
  ControllerTextField,
  ControllerTextFieldPassword,
  EntityMultipleSelecter,
  FormContent,
  FormFooter,
  FormHeader,
  FormLabel,
  FormPaperGrid,
} from 'components/Form';
import { useNotification } from 'hooks';
import { IUser, RoleMappingDto } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createUser, updateUser } from 'redux/slices/user';
import userService from 'services/user.service';
import randomPassword from 'utils/randomPasword';
import * as yup from 'yup';

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
    .required('Vui lòng nhập họ và tên.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập họ và tên.'),
  email: yup.string().email('Không đúng định dạng email.').notRequired(),
  phone: yup
    .string()
    .required('Vui lòng nhập số điện thoại.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập số điện thoại.'),
  role: yup
    .array()
    .min(1, 'Vui lòng chọn vai trò.')
    .required('Vui lòng chọn vai trò.'),
  userName: yup
    .string()
    .required('Vui lòng nhập tên đăng nhập.')
    .min(8, 'Tên tài khoản từ 8 đến 150 ký tự')
    .max(150, 'Tên tài khoản từ 8 đến 150 ký tự')
    // @ts-ignore
    .trimCustom('Vui lòng nhập tên đăng nhập.'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập mật khẩu.')
    .default(randomPassword(8, 15, true, true, true, true).toString()),
});

const Create = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setNotification = useNotification();
  const [roles, setRoles] = useState<RoleMappingDto[]>([]);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const isUpdate = useMemo(
    () => location.pathname.includes('/update'),
    [location]
  );

  const { control, handleSubmit, reset, setValue, getValues } = useForm<IUser>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (payload: IUser) => {
    setShowBackdrop(true);
    if (id) {
      const { error } = await dispatch(
        // @ts-ignore
        updateUser(payload)
      );
      if (error) {
        setNotification({ error: 'Lỗi!' });
        setShowBackdrop(false);
        return;
      }
      setNotification({
        message: 'Cập nhật thành công',
        severity: 'success',
      });
    } else {
      const { error } = await dispatch(
        // @ts-ignore
        createUser(payload)
      );
      if (error) {
        setNotification({ error: 'Lỗi!' });
        setShowBackdrop(false);
        return;
      }
      setNotification({
        message: 'Thêm thành công',
        severity: 'success',
      });
    }
    setShowBackdrop(false);
    return navigate('/hk_group/operate/users');
  };

  const fetchDataDetail = async () => {
    const { data } = await userService.get(id || '');

    const { name, phone, email, role, userName, password } = data;
    reset({
      name,
      phone,
      email,
      role,
      userName,
      password,
    });
  };
  const fetchData = async () => {
    const { data } = await userService.getAllRolesForAccount();
    setRoles(data);
    if (id) {
      fetchDataDetail();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <PageWrapper
      title={
        isUpdate
          ? 'Chỉnh sửa thông tin người dùng'
          : id
          ? 'Xem chi tiết thông tin'
          : 'Tạo mới người dùng'
      }
    >
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader
          title={
            isUpdate
              ? 'Chỉnh sửa thông tin người dùng'
              : id
              ? 'Xem chi tiết thông tin'
              : 'Tạo mới người dùng'
          }
        />
        <FormContent>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormLabel required title="Họ và tên" name="name" />
                <ControllerTextField
                  name="name"
                  control={control}
                  disabled={!isUpdate && Boolean(id)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormLabel required title="Số điện thoại" name="phone" />
                <ControllerTextField
                  name="phone"
                  control={control}
                  disabled={!isUpdate && Boolean(id)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Địa chỉ email" name="email" />
                <ControllerTextField
                  name="email"
                  control={control}
                  disabled={!isUpdate && Boolean(id)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Vai trò" required name="role" />
                <EntityMultipleSelecter
                  name="role"
                  control={control}
                  disabled={!isUpdate && Boolean(id)}
                  options={roles}
                  renderValue="id"
                  renderLabel={(field) => field.name}
                  noOptionsText="Không tìm thấy vai trò"
                  placeholder=""
                  defaultValue={getValues('role')}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel required title="Tên đăng nhập" name="userName" />
                <ControllerTextField
                  name="userName"
                  helperText={
                    <>
                      1. HK PRODUCT_Admin
                      <br />
                      2. HK CARE_Admin
                      <br />
                      3. HK TRADING_Admin
                    </>
                  }
                  control={control}
                  disabled={!isUpdate && Boolean(id)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Mật khẩu" required name="password" />
                <ControllerTextFieldPassword
                  name="password"
                  control={control}
                  disabled={!isUpdate && Boolean(id)}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>

        <FormFooter>
          <LinkButton to="/hk_group/operate/users">
            {isUpdate || !Boolean(id) ? 'Hủy' : 'Quay lại'}
          </LinkButton>

          {isUpdate || !Boolean(id) ? (
            <LoadingButton loading={showBackdrop} type="submit">
              Lưu
            </LoadingButton>
          ) : (
            <LinkButton to="update" variant="contained">
              Chỉnh sửa thông tin
            </LinkButton>
          )}
        </FormFooter>
      </FormPaperGrid>
    </PageWrapper>
  );
};

export default Create;
