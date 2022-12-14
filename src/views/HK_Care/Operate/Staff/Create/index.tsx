import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Backdrop,
  CircularProgress,
  Divider,
  FormGroup,
  Grid,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { LinkButton, LoadingScreen, PageWrapper } from 'components/common';
import {
  ControllerTextField,
  EntitySelecter,
  FormContent,
  FormFooter,
  FormHeader,
  FormLabel,
  FormPaperGrid,
} from 'components/Form';
import ControllerMultiFiles from 'components/Form/ControllerMultiFiles';
import { typeStringNumber } from 'constants/typeInput';
import { useNotification } from 'hooks';
import { IStaff } from 'interface';
import { useDispatch } from 'react-redux';
import { createStaff, getStaff, updateStaff } from 'redux/slices/staff';
import importReceiptService from 'services/importReceipt.service';
import staffService from 'services/staff.service';

interface IRole {
  roleId: string;
  roleName: string;
}

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
  idCard: yup.string().required('Vui lòng nhập số CMND/CCCD.'),
  phoneNumber: yup
    .string()
    .required('Vui lòng nhập số điện thoại.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập số điện thoại.')
    .min(9, 'Số điện thoại từ 9 đến 20 ký tự.')
    .max(20, 'Số điện thoại từ 9 đến 20 ký tự.')
    .strict(true)
    .default(''),
  email: yup
    .string()
    .email('Không đúng định dạng Email.')
    .required('Vui lòng nhập địa chỉ Email.'),
  roleId: yup.string().required('Vui lòng chọn vai trò.'),
  userName: yup
    .string()
    .required('Vui lòng nhập tên đăng nhập.')
    .matches(/^[A-Za-z0-9_-]+$/, 'Tên đăng nhập chỉ gồm chữ và số.')
    .test(
      'validateSpace',
      'Tên đăng nhập không chứa khoảng cách',
      function (item) {
        if (item?.includes(' ')) {
          return false;
        }
        return true;
      }
    ),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu.')
    .min(8, 'Mật khẩu từ 8-20 ký tự.')
    .max(20, 'Mật khẩu từ 8-20 ký tự.')
    // @ts-ignore
    .trimCustom('Vui lòng nhập mật khẩu.')
    .default(
      'HkCare@123'
      // randexp(
      //   /^(Hk)@(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/
      // )
    ),
});

const Create = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const setNotification = useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[] | object[]>([]);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [loadingFetchData, setLoadingFetchData] = useState<boolean>(false);
  const [roles, setRoles] = useState<IRole[]>([]);

  const isUpdate = useMemo(
    () => location.pathname.includes('/update'),
    [location]
  );

  const { control, setValue, handleSubmit, reset } = useForm<IStaff>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  // @ts-ignore
  const handleChangeFiles = async (newValue) => {
    setShowBackdrop(true);
    setFiles(newValue);
    // @ts-ignore
    await newValue.forEach(async (file, index, array) => {
      // @ts-ignore
      if (file?.type) {
        const { data } = await importReceiptService.getPathFileReceipt(file);
        // @ts-ignore
        setFiles((prev) => {
          const newFile = [...prev];
          // @ts-ignore
          newFile[index] = { name: file?.name, url: data };
          return newFile;
        });
      }
    });
  };

  useEffect(() => {
    if (!showBackdrop) return;
    // @ts-ignore
    const fileList = files.filter((item) => Boolean(item.type));
    if (fileList.length === 0) {
      setShowBackdrop(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, showBackdrop]);

  const onSubmit = async (body: IStaff) => {
    setLoading(true);
    if (id) {
      // @ts-ignore1
      const { payload, error } = await dispatch(
        // @ts-ignore
        updateStaff({
          ...body, // @ts-ignore
          namePathSalePointEmployeeStorageDtos: files,
          id,
        })
      );
      if (error) {
        setNotification({
          error: payload.response.data || 'Hệ thống đang gặp sự cố',
        });
        setLoading(false);
        return;
      }
      setNotification({
        message: 'Cập nhật thành công',
        severity: 'success',
      });
    } else {
      // @ts-ignore
      const { payload, error } = await dispatch(
        // @ts-ignore
        createStaff({
          ...body, // @ts-ignore
          namePathSalePointEmployeeStorageDtos: files,
        })
      );
      if (error) {
        setNotification({
          error: payload.response.data || 'Hệ thống đang gặp sự cố',
        });
        setLoading(false);
        return;
      }
      setNotification({
        message: 'Thêm thành công',
        severity: 'success',
      });
    }
    setLoading(false);
    return navigate('/hk_care/operate/staff');
  };

  const fetchDataUpdate = async () => {
    setLoadingFetchData(true);
    // @ts-ignore
    const { payload, error } = await dispatch(getStaff(id));
    if (error) {
      setNotification({
        error: 'Hệ thống đang gặp sự cố',
      });
      setLoadingFetchData(false);
      return;
    }

    reset(payload.staff);
    setFiles(payload.staff.files);
    setLoadingFetchData(false);
  };

  const fetchRoles = async () => {
    const { data } = await staffService.getRoles();
    setRoles(data);
  };

  useEffect(() => {
    if (id) {
      fetchDataUpdate();
    }
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingFetchData) {
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
                <FormLabel required title="Số CMND/CCCD" name="idCard" />
                <ControllerTextField
                  inputProps={typeStringNumber((value) =>
                    setValue('idCard', value)
                  )}
                  name="idCard"
                  control={control}
                  disabled={!isUpdate && Boolean(id)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel required title="Số điện thoại" name="phoneNumber" />
                <ControllerTextField
                  inputProps={typeStringNumber((value) =>
                    setValue('phoneNumber', value)
                  )}
                  name="phoneNumber"
                  control={control}
                  disabled={!isUpdate && Boolean(id)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Địa chỉ Email" required name="email" />
                <ControllerTextField
                  name="email"
                  control={control}
                  disabled={!isUpdate && Boolean(id)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel title="Vai trò" required name="roleId" />
                <EntitySelecter
                  name="roleId"
                  control={control}
                  disabled={!isUpdate && Boolean(id)}
                  options={roles}
                  renderLabel={(field) => field.roleName}
                  renderValue="roleId"
                  noOptionsText="Không tìm thấy vai trò"
                  placeholder=""
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="File đính kèm" name="roleId" />
                <Grid container gap={1} gridTemplateRows={'auto 1fr auto'}>
                  <ControllerMultiFiles
                    files={files}
                    setFiles={(newValue) => {
                      handleChangeFiles(newValue);
                    }}
                    message="Tài liệu đính kèm chỉ cho phép file pdf và ảnh."
                    disabled={!isUpdate && Boolean(id)}
                    max={7}
                  />
                </Grid>
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
                      HK[DiaChiDiemBan]_HoVaTen
                      <br />
                      Ví dụ: HK46NuiTruc_NguyenThuTrang
                    </>
                  }
                  control={control}
                  disabled={Boolean(id)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormLabel title="Mật khẩu" required name="password" />
                <ControllerTextField
                  name="password"
                  control={control}
                  disabled={!isUpdate && Boolean(id)}
                  helperText={
                    <>
                      Mật khẩu từ 8-20 ký tự bao gồm ít nhất một chữ in hoa, một
                      chữ thường, một chữ số và một ký tự đặc biệt
                      <br />
                      Ví dụ: abcXYZ123@
                    </>
                  }
                />
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>

        <FormFooter>
          <LinkButton to="/hk_care/operate/staff">Quay lại</LinkButton>

          {isUpdate || !Boolean(id) ? (
            <LoadingButton loading={loading} type="submit">
              Lưu
            </LoadingButton>
          ) : (
            <LinkButton to="update" variant="contained">
              Chỉnh sửa thông tin
            </LinkButton>
          )}
        </FormFooter>
      </FormPaperGrid>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBackdrop}
        onClick={() => setShowBackdrop(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </PageWrapper>
  );
};

export default Create;
