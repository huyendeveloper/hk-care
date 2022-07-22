import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Divider, FormGroup, Grid } from '@mui/material';
import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { LinkButton, LoadingScreen, PageWrapper } from 'components/common';
import {
  ControllerSwitch,
  ControllerTextField,
  EntityMultipleSelecter,
  FormContent,
  FormFooter,
  FormHeader,
  FormLabel,
  FormPaperGrid,
} from 'components/Form';
import { yupDate, yupOnlyNumber } from 'constants/typeInput';
import { IStaff, ISupplier } from 'interface';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

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
    .required('Vui lòng nhập tên sản phẩm.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập tên sản phẩm.'),
  productGroupId: yupOnlyNumber('Vui lòng chọn nhóm sản phẩm.'),
  treamentGroupId: yupOnlyNumber('Vui lòng chọn nhóm điều trị.'),
  usageId: yupOnlyNumber('Vui lòng chọn dạng dùng.'),
  mesureLevelFisrt: yupOnlyNumber('Vui lòng chọn đơn vị cấp 1.'),
  outOfDate: yupDate,
  dosage: yup
    .string()
    .required('Vui lòng nhập hàm lượng.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập hàm lượng.')
    .default('Null'),
  routeOfUse: yup
    .string()
    .required('Vui lòng nhập liều dùng.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập liều dùng.')
    .default('Theo chỉ định'),
  dateManufacture: yupDate,
});

const Create = () => {
  const { id } = useParams();
  const location = useLocation();
  const [supplierList, setSupplierList] = useState<ISupplier[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[] | object[]>([]);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);

  const { userRoles } = useSelector((state: RootState) => state.auth);

  const isUpdate = useMemo(
    () => location.pathname.includes('/update'),
    [location]
  );

  const { control, setValue, getValues, handleSubmit, reset } = useForm<IStaff>(
    {
      mode: 'onChange',
      resolver: yupResolver(validationSchema),
      defaultValues: validationSchema.getDefault(),
    }
  );

  const active = useWatch({ control, name: 'active' });

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
              {userRoles.includes('hkl2') && (
                <Grid item xs={12} md={6}>
                  <FormLabel title="Điểm bán" name="roleId" />
                  <EntityMultipleSelecter
                    name="roleId"
                    control={control}
                    disabled={!isUpdate && Boolean(id)}
                    options={supplierList}
                    renderLabel={(field) => field.name}
                    noOptionsText="Không tìm thấy nhà cung cấp"
                    placeholder=""
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <FormLabel title="Vai trò" name="roleId" />
                <EntityMultipleSelecter
                  name="roleId"
                  control={control}
                  disabled={!isUpdate && Boolean(id)}
                  options={supplierList}
                  renderLabel={(field) => field.name}
                  noOptionsText="Không tìm thấy nhà cung cấp"
                  placeholder=""
                />
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel required title="Tên đăng nhập" name="username" />
                <ControllerTextField
                  name="username"
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
              <Grid item xs={12} md={6}>
                <FormLabel title="Trạng thái" name="active" />
                <ControllerSwitch
                  name="active"
                  label={active ? 'Hoạt động' : 'Không hoạt động'}
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
