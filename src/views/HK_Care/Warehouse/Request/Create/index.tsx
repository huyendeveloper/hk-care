import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { LinkButton, Scrollbar } from 'components/common';
import PageWrapperFullwidth from 'components/common/PageWrapperFullwidth';
import {
  ControllerTextarea,
  FormContent,
  FormFooter,
  FormGroup,
  FormHeader,
  FormLabel,
  FormPaperGrid,
  Selecter,
} from 'components/Form';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableWrapper,
} from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IProductRequestImport, IRequestImport } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addExpectedDetails,
  createExpected,
  getExpected,
} from 'redux/slices/expected';
import expectedService from 'services/expected.service';
import salesOrderService from 'services/salesOrder.service';
import { FilterParams } from 'types';

import * as yup from 'yup';
import ProductEntity from './ProductEntity';

const validationSchema = yup.object().shape({});

interface IProductListName {
  id: number;
  name: string;
  amount: number;
  path: string;
  productName: string;
  productId: number;
  productImage: string;
}

const getCells = (): Cells<IProductRequestImport> => [
  { id: 'name', label: 'STT' },
  { id: 'name', label: 'Tên sản phẩm' },
  { id: 'measureName', label: 'Đơn vị' },
  { id: 'budget', label: 'Dự trù tự động' },
  { id: 'addBudget', label: 'Thêm dự trù' },
  { id: 'addBudget', label: 'Tổng số lượng' },
  { id: 'addBudget', label: '' },
];

const Create = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setNotification = useNotification();

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [loadingProduct, setLoadingProduct] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [productIdAdd, setProductIdAdd] = useState<number | null>(null);
  const [productList, setProductList] = useState<IProductListName[]>([]);

  const cells = useMemo(() => getCells(), []);

  const { control, handleSubmit, getValues, setValue, reset } =
    useForm<IRequestImport>({
      mode: 'onChange',
      resolver: yupResolver(validationSchema),
      defaultValues: validationSchema.getDefault(),
    });

  const fetchProducts = async () => {
    setLoadingProduct(true);
    const { data } = await salesOrderService.getSearchProductList(filters);
    setProductList(data.items);
    setLoadingProduct(false);
  };

  const fetchToAddExpectedDetails = async () => {
    setLoading(true);
    // @ts-ignore
    const { payload, error } = await dispatch(addExpectedDetails(id));

    if (error) {
      setNotification({ error: 'Lỗi!' });
      return;
    }
    const expectedList = payload.expectedList;
    expectedList.forEach((item: any) => {
      append(item);
    });

    setLoading(false);
  };

  const fetchDetails = async () => {
    setLoading(true);
    // @ts-ignore
    const { payload, error } = await dispatch(getExpected(id));

    if (error) {
      setNotification({ error: 'Lỗi!' });
      return;
    }
    reset(payload.expected);

    setLoading(false);
  };

  useEffect(() => {
    if (!id) {
      fetchProducts();
      fetchToAddExpectedDetails();
    } else {
      fetchDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
      sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };

  const onSubmit = async (body: IRequestImport) => {
    setLoadingSubmit(true);
    if (!id) {
      const { error } = await dispatch(
        // @ts-ignore
        createExpected(body)
      );
      if (error) {
        setNotification({ error: 'Lỗi!' });
        setLoadingSubmit(false);
        return;
      }
      setNotification({
        message: 'Tạo yêu cầu nhập kho thành công',
        severity: 'success',
      });

      setLoadingSubmit(false);
      return navigate('/hk_care/warehouse/request');
    }
  };

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

  const { fields, append, remove } = useFieldArray<IRequestImport>({
    control,
    name: 'expectedDetails',
  });

  const addProduct = async () => {
    if (!productIdAdd) {
      return;
    }
    setLoadingAdd(true);
    const { data } = await expectedService.addExpectedDetail(productIdAdd);
    append(data);
    setLoadingAdd(false);
  };

  return (
    <PageWrapperFullwidth title="Tạo mới yêu cầu nhập hàng">
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
            <FormHeader title="Danh sách sản phẩm" />
            <FormContent sx={{ minHeight: '60vh' }}>
              <Grid item xs={12} mb={2}>
                {!id && (
                  <FormGroup sx={{ mb: 2 }}>
                    <FormLabel title="Tìm kiếm sản phẩm" name="name" />
                    <Stack flexDirection="row" gap={2}>
                      <Selecter
                        renderValue="productId"
                        options={productList}
                        renderLabel={(field) => field.productName}
                        noOptionsText="Không tìm thấy sản phẩm"
                        placeholder=""
                        images="productImage"
                        onChangeSelect={(value: number | null) => {
                          setProductIdAdd(value);
                        }}
                        defaultValue=""
                        loading={loadingProduct}
                      />
                      <LoadingButton
                        onClick={addProduct}
                        loading={loadingAdd}
                        loadingPosition="start"
                        startIcon={<></>}
                        sx={{ height: '40px', width: '100px' }}
                      >
                        Thêm
                      </LoadingButton>
                    </Stack>
                  </FormGroup>
                )}

                <TableWrapper
                  sx={{ height: 1, minHeight: '50vh' }}
                  component={Paper}
                >
                  <TableContent total={1} noDataText=" " loading={loading}>
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
                            {[...fields]
                              .splice(
                                (filters.pageIndex - 1) * 10,
                                filters.pageIndex * 10
                              )
                              .map((item, index) => (
                                <ProductEntity
                                  key={index}
                                  index={index}
                                  remove={remove}
                                  getValues={getValues}
                                  arrayName="expectedDetails"
                                  setValue={setValue}
                                  control={control}
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
              </Grid>
            </FormContent>
            <FormFooter>
              <LinkButton to="/hk_care/warehouse/request">Hủy</LinkButton>
              {!id && (
                <LoadingButton type="submit" loading={loadingSubmit}>
                  Gửi yêu cầu
                </LoadingButton>
              )}
            </FormFooter>
          </FormPaperGrid>
        </Grid>
        <Grid item xs={12} md={3}>
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
                disabled={id ? true : false}
              />
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </PageWrapperFullwidth>
  );
};

export default Create;
