import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton, usePagination } from '@mui/lab';
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
import { TableContent, TableHeader, TableWrapper } from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IProductRequestImport, IRequestImport } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAllProduct } from 'redux/slices/exportWHRotation';
import { FilterParams } from 'types';

import * as yup from 'yup';
import ProductEntity from './ProductEntity';

const validationSchema = yup.object().shape({});

interface IProductListName {
  id: number;
  name: string;
  amount: number;
  path: string;
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
  const setNotification = useNotification();
  const [productList, setProductList] = useState<IProductListName[]>([]);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [loading, setLoading] = useState<boolean>(true);

  const cells = useMemo(() => getCells(), []);

  const { control, handleSubmit, getValues, setValue } =
    useForm<IRequestImport>({
      mode: 'onChange',
      resolver: yupResolver(validationSchema),
      defaultValues: validationSchema.getDefault(),
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

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
      sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };

  const onSubmit = async (data: IRequestImport) => {};

  const { fields, append, remove } = useFieldArray<IRequestImport>({
    control,
    name: 'productRequestImports',
  });

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
                        renderValue="id"
                        options={productList}
                        renderLabel={(field) => field.name}
                        noOptionsText="Không tìm thấy sản phẩm"
                        placeholder=""
                        onChangeSelect={(value: number | null) => {
                          // setDetailAdd({ ...detailAdd, productId: value })
                        }}
                        defaultValue=""
                        loading={loading}
                      />
                      <LoadingButton
                        // onClick={addProduct}
                        // loading={loadingAdd}
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
                  <TableContent total={1} noDataText=" " loading={false}>
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
                              <ProductEntity
                                item={item}
                                key={index}
                                index={index}
                                remove={remove}
                                getValues={getValues}
                                arrayName="productRequestImports"
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
            </FormContent>
            <FormFooter>
              <LinkButton to="/hk_care/warehouse/request">Hủy</LinkButton>
              {!id && <LoadingButton type="submit">Gửi yêu cầu</LoadingButton>}
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
