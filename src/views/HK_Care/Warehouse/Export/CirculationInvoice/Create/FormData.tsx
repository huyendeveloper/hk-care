import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  FormGroup,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
import { LinkButton, Scrollbar } from 'components/common';
import PageWrapperFullwidth from 'components/common/PageWrapperFullwidth';
import {
  ControllerTextarea,
  EntitySelecter,
  FormContent,
  FormFooter,
  FormHeader,
  FormLabel,
  FormPaperGrid,
} from 'components/Form';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableWrapper,
} from 'components/Table';
import SearchField from 'components/Table/SearchField';
import { Cells } from 'components/Table/TableHeader';
import { connectURL } from 'config';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IExportWHRotation, IProductExportCancel, ITenant } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createExportWH,
  getAllProduct,
  updateExportWH,
} from 'redux/slices/exportWHRotation';
import exportWHRotationService from 'services/exportWHRotation.service';
import tenantService from 'services/tenant.service';
import { FilterParams } from 'types';
import LocalStorage from 'utils/LocalStorage';
import * as yup from 'yup';
import ReceiptEntity from './ReceiptEntity';
import TotalBill from './TotalBill';

interface IProductListName {
  id: number;
  name: string;
  amount: number;
  path: string;
}

interface IProps {
  defaultValue: IExportWHRotation | null;
}

const validationSchema = yup.object().shape({
  rotationPoint: yup
    .string()
    .required('Vui lòng chọn điểm bán nhận.')
    .typeError('Vui lòng chọn điểm bán nhận.'),
  exportWHDetails: yup.array().of(
    yup.object().shape({
      amount: yup
        .number()
        .required('Vui lòng nhập.')
        .typeError('Vui lòng nhập.'),
    })
  ),
});

const getCells = (): Cells<IExportWHRotation> => [
  { id: 'code', label: 'STT' },
  { id: 'code', label: 'Tên sản phẩm' },
  { id: 'code', label: 'Đơn vị' },
  { id: 'code', label: 'Số lượng' },
  { id: 'code', label: 'Giá vốn' },
  { id: 'code', label: 'Giá trị xuất' },
  { id: 'code', label: '' },
];

const FormData = ({ defaultValue }: IProps) => {
  const { id, exportWHId } = useParams();

  const dispatch = useDispatch();
  const setNotification = useNotification();
  const navigate = useNavigate();
  const [productList, setProductList] = useState<IProductListName[]>([]);
  const [tenantList, setTenantList] = useState<ITenant[]>([]);
  const [loadingTenant, setLoadingTenant] = useState<boolean>(true);
  const [hidden, setHidden] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [loading, setLoading] = useState<boolean>(true);

  const handleChangePage = (pageIndex: number) => {
    setFilters((state) => ({
      ...state,
      pageIndex,
    }));
  };

  const handleChangeRowsPerPage = (rowsPerPage: number) => {
    setFilters((state) => ({
      ...state,
      pageIndex: 1,
      pageSize: rowsPerPage,
    }));
  };

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const cells = useMemo(() => getCells(), []);

  const { control, setValue, getValues, handleSubmit } =
    useForm<IExportWHRotation>({
      mode: 'onChange',
      resolver: yupResolver(validationSchema),
      defaultValues: defaultValue || validationSchema.getDefault(),
    });

  const { fields, append, remove } = useFieldArray<IExportWHRotation>({
    control,
    name: 'exportWHDetails',
  });

  const fetchData = async () => {
    setLoading(true);
    // @ts-ignore
    const { payload, error } = await dispatch(getAllProduct(filters));

    if (error) {
      setNotification({ error: 'Lỗi!' });
      return;
    }
    setProductList(payload.productList);
    setLoading(false);
  };

  const fetchTenants = async () => {
    try {
      const { data } = await tenantService.getTenants();
      setTenantList(
        data.filter(
          (item: ITenant) => item.name !== LocalStorage.get('tennant')
        )
      );
      setLoadingTenant(false);
    } catch (error) {
      setLoadingTenant(false);
    }
  };

  useEffect(() => {
    fetchTenants();
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: IExportWHRotation) => {
    // @ts-ignore
    if (data?.exportWHDetails?.length < 1) {
      setNotification({ error: 'Bạn chưa nhập sản phẩm nào' });
      return;
    }

    const newPayload = {
      ...data,
      totalFee:
        data.exportWHDetails.reduce(
          // @ts-ignore
          (prev, cur) =>
            prev + (Number(cur?.amount) || 0) * (Number(cur?.importPrice) || 0),
          0
        ) || 0,
      exportType: 3,
    };
    if (id || exportWHId) {
      const { error, payload } = await dispatch(
        // @ts-ignore
        updateExportWH({ ...newPayload, id, exportWHId })
      );
      if (error) {
        setNotification({ error: payload.response.data || 'Lỗi!' });
        return;
      }
      setNotification({
        message: 'Cập nhật thành công',
        severity: 'success',
      });
      return navigate(`/hk_care/warehouse/export/circulation_invoice`);
    }
    const { payload, error } = await dispatch(
      // @ts-ignore
      createExportWH(newPayload)
    );
    if (error) {
      setNotification({ error: payload.response.data || 'Lỗi!' });
      return;
    }
    setNotification({
      message: 'Thêm thành công',
      severity: 'success',
    });
    return navigate(`/hk_care/warehouse/export/circulation_invoice`);
  };

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
    }));
  };

  const handleClose = () => {
    setHidden(true);
  };

  const timer = () => {
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  const handleSearch = (searchText: string) => {
    setFilters((state) => ({
      ...state,
      searchText,
      pageSize: 1000,
    }));
  };

  const addItem = async (item: IProductListName) => {
    try {
      const { data } = await exportWHRotationService.addToListExportWHRotation(
        item.id
      );
      if (data.length === 0) {
        setNotification({ error: 'Số lượng không đủ.' });
        return;
      }
      // @ts-ignore
      if (!fields.some((e) => e.productId === data.productId)) {
        if (id) {
          append({
            ...data,
            amount: 1,
            maxQuantity: data.amount,
            // @ts-ignore
            orderId: data.id,
            id: 0,
          });
        } else {
          // @ts-ignore
          append({
            ...data,
            amount: 1,
            maxQuantity: data.amount, // @ts-ignore
            orderId: data.id,
          });
        }
      }
      setFilters({ ...filters, sortBy: '' });
    } catch (error) {
      setNotification({ error: 'Lỗi!' });
    }
  };

  return (
    <PageWrapperFullwidth title={id ? 'Cập nhật hóa đơn' : 'Thêm hóa đơn'}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
            <FormHeader title=" " hidden />
            <FormContent>
              <FormGroup>
                <Grid item xs={12} mb={2}>
                  <FormLabel title="Tìm kiếm sản phẩm" name="name" />

                  <Box
                    sx={{
                      paddingY: 1,
                      width: '100%',
                      maxWidth: '100%',
                      position: 'relative',
                    }}
                  >
                    <SearchField
                      placeHolder="Thêm sản phẩm vào đơn"
                      searchText=""
                      onSearch={handleSearch}
                      haveIcon
                      onFocus={() => setHidden(false)}
                      onBlur={timer}
                    />
                    {!hidden && productList.length > 0 && (
                      <Stack
                        sx={{
                          position: 'absolute',
                          top: '55px',
                          right: '0px',
                          left: 0,
                          marginRight: '8px',
                          borderRadius: '4px',
                          background: 'white',
                          border: '1px solid #d9d9d9',
                          maxHeight: '350px',
                          overflowY: 'scroll',
                          zIndex: 99,
                        }}
                      >
                        {productList
                          .filter((x) =>
                            x.name
                              .toLocaleLowerCase()
                              .includes(filters.searchText.toLocaleLowerCase())
                          )
                          .map((item, index) => (
                            <Stack
                              flexDirection="row"
                              justifyContent="space-between"
                              alignItems="center"
                              key={index}
                              // @ts-ignore
                              onClick={() => addItem(item)}
                              p={2}
                              sx={{ borderBottom: '1px solid #d9d9d9' }}
                            >
                              <Stack flexDirection="row">
                                <Box
                                  component="img"
                                  sx={{
                                    width: '100px',
                                    height: '70px',
                                    backgroundImage:
                                      'https://www.vigcenter.com/public/all/images/default-image.jpg',
                                  }}
                                  src={`${connectURL}/${item.path}`}
                                  alt=""
                                />
                                <Box pl={2}>{item.name}</Box>
                              </Stack>
                              {/* <div>Có thể bán: {item.amount}</div> */}
                            </Stack>
                          ))}
                      </Stack>
                    )}
                    {!hidden &&
                      productList.filter((x) =>
                        x.name
                          .toLocaleLowerCase()
                          .includes(filters.searchText.toLocaleLowerCase())
                      ).length === 0 && (
                        <Stack
                          sx={{
                            position: 'absolute',
                            top: '55px',
                            right: '0px',
                            left: 0,
                            marginRight: '8px',
                            borderRadius: '4px',
                            background: 'white',
                            border: '1px solid #d9d9d9',
                            maxHeight: '350px',
                            zIndex: 99,
                          }}
                        >
                          <Stack
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            p={2}
                            sx={{ borderBottom: '1px solid #d9d9d9' }}
                          >
                            {loading
                              ? 'Đang tải . . .'
                              : 'Không tìm thấy kết quả nào.'}
                          </Stack>
                        </Stack>
                      )}
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ minHeight: '200px' }}>
                  <TableWrapper
                    sx={{ height: 1, minHeight: '200px' }}
                    component={Paper}
                  >
                    <TableContent total={1} noDataText=" " loading={false}>
                      <TableContainer sx={{ p: 1.5, maxHeight: '60vh' }}>
                        <Scrollbar>
                          <Table sx={{ minWidth: 'max-content' }} size="small">
                            <TableHeader
                              cells={cells}
                              onSort={handleOnSort}
                              sortDirection={filters.sortDirection}
                              sortBy={filters.sortBy}
                            />

                            <TableBody>
                              {fields.map((item, index) => (
                                <ReceiptEntity
                                  item={item}
                                  key={index}
                                  index={index}
                                  setValue={setValue}
                                  getValues={getValues}
                                  arrayName="exportWHDetails"
                                  control={control}
                                  remove={remove}
                                />
                              ))}
                            </TableBody>
                          </Table>
                        </Scrollbar>
                      </TableContainer>
                    </TableContent>
                  </TableWrapper>
                </Grid>
                <Grid container alignItems="center">
                  <Grid item xs={12}>
                    <TablePagination
                      pageIndex={filters.pageIndex}
                      totalPages={fields.length}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      rowsPerPage={filters.pageSize}
                      rowsPerPageOptions={[10, 20, 30, 40, 50]}
                    />
                  </Grid>
                  <Grid item xs={12} p={2}>
                    <TotalBill
                      control={control}
                      setValue={setValue}
                      getValues={getValues}
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </FormContent>
            <FormFooter>
              <LinkButton to="/hk_care/warehouse/export/circulation_invoice">
                Hủy
              </LinkButton>

              <LoadingButton type="submit">
                {id ? 'Lưu' : 'Xuất hàng'}
              </LoadingButton>
            </FormFooter>
          </FormPaperGrid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography
              color="text.secondary"
              sx={{ mb: 1.5, fontWeight: 'regular', fontSize: '1.74rem' }}
            >
              Thông tin phiếu chuyển
            </Typography>
            {tenantList.length > 0 && (
              <>
                <Grid item xs={12}>
                  <FormLabel title="Điểm bán nhận" name="description" />
                </Grid>
                <Grid item xs={12}>
                  <EntitySelecter
                    name="rotationPoint"
                    control={control}
                    options={tenantList}
                    renderLabel={(field) => field.name}
                    noOptionsText="Không tìm thấy điểm bán"
                    loading={loadingTenant}
                    placeholder=""
                  />
                </Grid>
              </>
            )}
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Grid item xs={12}>
              <FormLabel title="Ghi chú" name="description" />
            </Grid>
            <Grid item xs={12}>
              <ControllerTextarea
                maxRows={11}
                minRows={11}
                name="description"
                control={control}
              />
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </PageWrapperFullwidth>
  );
};

export default FormData;
