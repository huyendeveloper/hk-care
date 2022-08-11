import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Divider, FormGroup, Grid } from '@mui/material';

import { LinkButton, LoadingScreen, PageWrapper } from 'components/common';
import {
  ControllerTextField,
  EntityMultipleSelecter,
  FormContent,
  FormFooter,
  FormHeader,
  FormLabel,
  FormPaperGrid,
} from 'components/Form';
import { IRole, IStaff } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { RootState } from 'redux/store';
import userService from 'services/user.service';
import * as yup from 'yup';

const randexp = require('randexp').randexp;

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
  phoneNumber: yup
    .string()
    .required('Vui lòng nhập số điện thoại.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập số điện thoại.'),
  roleId: yup
    .string()
    .required('Vui lòng chọn vai trò.')
    // @ts-ignore
    .trimCustom('Vui lòng chọn vai trò.'),
  userName: yup
    .string()
    .required('Vui lòng nhập tên đăng nhập.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập tên đăng nhập.'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập mật khẩu.')
    .default(
      randexp(
        /^(Hk)@(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/
      )
    ),
  // .default(Math.random().toString(36).slice(-8)),
});

const Create = () => {
  const { id } = useParams();
  const location = useLocation();
  const [roles, setRoles] = useState<IRole[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);

  const { userRoles } = useSelector((state: RootState) => state.auth);

  const isUpdate = useMemo(
    () => location.pathname.includes('/update'),
    [location]
  );

  const { control, handleSubmit } = useForm<IStaff>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (payload: IStaff) => {
    // setShowBackdrop(true);
    // const { error } = await dispatch(
    //   // @ts-ignore
    //   updateProduct({ ...payload, image })
    // );
    // if (error) {
    //   setNotification({ error: 'Lỗi!' });
    //   setShowBackdrop(false);
    //   return;
    // }
    // setNotification({
    //   message: 'Cập nhật thành công',
    //   severity: 'success',
    // });
    // setDisabled(true);
    // setShowBackdrop(false);
  };

  const fetchRoleList = () => {
    userService
      .getAllRoles()
      // @ts-ignore
      .then(({ data }) => {
        // setRoles(data);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  useEffect(() => {
    fetchRoleList();
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
                <FormLabel required title="Số điện thoại" name="phoneNumber" />
                <ControllerTextField
                  name="phoneNumber"
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
              {userRoles.includes('hkl2') && (
                <Grid item xs={12} md={6}>
                  <FormLabel title="Điểm bán" name="roleId" />
                  <EntityMultipleSelecter
                    name="roleId"
                    control={control}
                    disabled={!isUpdate && Boolean(id)}
                    options={roles}
                    renderLabel={(field) => field.roleName}
                    noOptionsText="Không tìm thấy vai trò"
                    placeholder=""
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <FormLabel title="Vai trò" required name="roleId" />
                <EntityMultipleSelecter
                  name="roleId"
                  control={control}
                  disabled={!isUpdate && Boolean(id)}
                  options={roles}
                  renderLabel={(field) => field.roleName}
                  noOptionsText="Không tìm thấy vai trò"
                  placeholder=""
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
                <ControllerTextField
                  name="password"
                  control={control}
                  disabled={!isUpdate && Boolean(id)}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>

        <FormFooter>
          <LinkButton to="/hk_group/users">
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
