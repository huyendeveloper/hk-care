import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Divider, FormGroup, Grid } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { LinkButton, LoadingScreen, PageWrapper } from 'components/common';
import {
  ControllerMultiFile,
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
          ? 'Chỉnh sửa thông tin nhân viên'
          : id
          ? 'Xem chi tiết thông tin'
          : 'Tạo mới nhân viên'
      }
    >
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader
          title={
            isUpdate
              ? 'Chỉnh sửa thông tin nhân viên'
              : id
              ? 'Xem chi tiết thông tin'
              : 'Tạo mới nhân viên'
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
                <FormLabel required title="Số CMND/CCCD" name="identityCard" />
                <ControllerTextField
                  name="identityCard"
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
              <Grid item xs={12}>
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
              <Grid item xs={12} md={6}>
                <FormLabel title="File đính kèm" name="roleId" />
                <Grid container gap={1} gridTemplateRows={'auto 1fr auto'}>
                  <ControllerMultiFile
                    files={files}
                    setFiles={setFiles}
                    max={7}
                    accept="image/*,application/pdf"
                    message="Tài liệu đính kèm chỉ cho phép file pdf và ảnh."
                    viewOnly={!isUpdate && Boolean(id)}
                  />
                </Grid>
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
                      HK [Dia chi diem ban] - Ho va ten
                      <br />
                      Ví dụ: HK 46 Nui Truc - Nguyen Thu Trang
                    </>
                  }
                  control={control}
                  disabled={!isUpdate && Boolean(id)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Mật khẩu" name="password" />
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
                  label={active ? 'Đang làm việc' : 'Đã nghỉ làm'}
                  control={control}
                  disabled={!isUpdate && Boolean(id)}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>

        <FormFooter>
          <LinkButton to="/hk_care/operate/staff">
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
