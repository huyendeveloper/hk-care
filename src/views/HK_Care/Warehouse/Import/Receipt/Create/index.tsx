import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  FormGroup,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { LinkButton, Scrollbar } from 'components/common';
import PageWrapperFullwidth from 'components/common/PageWrapperFullwidth';
import {
  ControllerTextarea,
  ControllerTextField,
  FormContent,
  FormFooter,
  FormHeader,
  FormLabel,
  FormPaperGrid,
  Selecter,
} from 'components/Form';
import { TableContent, TableHeader, TableWrapper } from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IReceipt } from 'interface';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProduct } from 'redux/slices/productList';
import { RootState } from 'redux/store';
import { FilterParams } from 'types';
import * as yup from 'yup';
import ReceiptEntity from './ReceiptEntity';

const validationSchema = yup.object().shape({});

const getCells = (): Cells<IReceipt> => [
  { id: 'productId', label: 'STT' },
  { id: 'productName', label: 'Tên sản phẩm' },
  { id: 'mesure', label: 'Đơn vị' },
  { id: 'mesure', label: 'Số lượng' },
  { id: 'mesure', label: 'Giá nhập' },
  { id: 'mesure', label: 'Giá bán' },
  { id: 'productGroup', label: 'Chiết khấu' },
  { id: 'stockQuantity', label: 'Thành tiền' },
  { id: 'importPrice', label: 'Số lô' },
  { id: 'price', label: 'Số đăng ký' },
  { id: 'price', label: 'Ngày sản xuất' },
  { id: 'mesure', label: 'Hạn dùng' },
  { id: 'mesure', label: '' },
];

const CreateForm = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [productList, setProductList] = useState<IReceipt[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const { loading } = useSelector((state: RootState) => state.productList);
  const [productSearch, setProductSearch] = useState<IReceipt[]>([]);
  const [filters, setFilters] = useState<FilterParams>({
    ...defaultFilters,
    pageSize: 1000,
  });

  const cells = useMemo(() => getCells(), []);

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IReceipt>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const { fields, append, remove } = useFieldArray<IReceipt>({
    control,
    name: 'productList',
  });

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getAllProduct(filters));

    if (error) {
      setNotification({
        error: 'Lỗi khi tải danh sách sản phẩm!',
      });
      return;
    }
    setProductList(payload.productList);
    setTotalRows(payload.totalCount);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (payload: IReceipt) => {
    console.log('payload', payload);
    // const { error } = await dispatch(
    //   // @ts-ignore
    //   updateProduct({ ...payload, image })
    // );
    // if (error) {
    //   setNotification({ error: 'Lỗi khi cập nhật sản phẩm!' });
    //   return;
    // }
    // setNotification({
    //   message: 'Cập nhật thành công',
    //   severity: 'success',
    // });
  };

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
    }));
  };

  const onChangeSelect = (value: number | null) => {
    const productSelected = productList.filter((x) => x.productId === value)[0];
    console.log('productSelected', productSelected);
    append(productSelected);
  };

  return (
    <PageWrapperFullwidth title="Thêm hóa đơn">
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader title="Thông tin sản phẩm" />
        <FormContent>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormLabel title="Tìm kiếm sản phẩm" name="name" />
                <Selecter
                  options={productList}
                  renderLabel={(field) => field.productName}
                  noOptionsText="Không tìm thấy sản phẩm"
                  placeholder=""
                  onChangeSelect={onChangeSelect}
                />
              </Grid>
              <Grid item xs={12} sx={{ minHeight: '200px' }}>
                <TableWrapper sx={{ height: 1 }} component={Paper}>
                  <TableContent
                    total={fields.length}
                    noDataText=" "
                    loading={loading}
                  >
                    <TableContainer sx={{ p: 1.5 }}>
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
                                index={index}
                                remove={remove}
                                errors={errors}
                                register={register}
                                setValue={setValue}
                                getValues={getValues}
                                arrayName="productList"
                              />
                            ))}
                          </TableBody>
                        </Table>
                      </Scrollbar>
                    </TableContainer>
                  </TableContent>
                </TableWrapper>
              </Grid>
              <Grid container xs={12}>
                <Grid item lg={9} xs={0}></Grid>
                <Grid item lg={3} xs={12} p={2}>
                  <div>Tổng tiền</div>
                  <Grid container xs={12}>
                    <Grid item xs={4}>
                      Thuế VAT (%)
                    </Grid>
                    <Grid item xs={8}>
                      <ControllerTextField
                        name="quantity"
                        variant="standard"
                        control={control}
                      />
                    </Grid>
                  </Grid>
                  <Grid container xs={12}>
                    <Grid item xs={4}>
                      Chiết khấu
                    </Grid>
                    <Grid item xs={8}>
                      <ControllerTextField
                        name="quantity"
                        variant="standard"
                        control={control}
                      />
                    </Grid>
                  </Grid>
                  <Grid container xs={12}>
                    <Grid item xs={4}>
                      Tiền cần trả
                    </Grid>
                    <Grid item xs={8}>
                      0
                    </Grid>
                  </Grid>
                  <Grid container xs={12}>
                    <Grid item xs={4}>
                      Đã thanh toán
                    </Grid>
                    <Grid item xs={8}>
                      <ControllerTextField
                        name="quantity"
                        variant="standard"
                        control={control}
                      />
                    </Grid>
                  </Grid>
                  <Grid container xs={12}>
                    <Grid item xs={4}>
                      Công nợ
                    </Grid>
                    <Grid item xs={8}>
                      0
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
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
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Tài liệu đính kèm" name="description" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextarea
                    maxRows={11}
                    minRows={11}
                    name="quantity"
                    control={control}
                  />
                </Grid>
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>
        <FormFooter>
          <LinkButton to="/hk_care/warehouse/import/receipt">Hủy</LinkButton>

          <LoadingButton type="submit">Nhập kho</LoadingButton>
        </FormFooter>
      </FormPaperGrid>
    </PageWrapperFullwidth>
  );
};

export default CreateForm;
