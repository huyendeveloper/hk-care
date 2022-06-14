import { LoadingButton } from '@mui/lab';
import { Grid, Paper, Table, TableBody, TableContainer } from '@mui/material';
import { Scrollbar } from 'components/common';
import {
  FormContent,
  FormFooter,
  FormHeader,
  FormPaperGrid,
} from 'components/Form';
import { TableContent, TableHeader, TableWrapper } from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { ISearchProduct } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addProductSales } from 'redux/slices/salesOrder';
import { RootState } from 'redux/store';
import { FilterParams } from 'types';
import OrderDetail from './OrderDetail';
import OrderProduct from './OrderProduct';

interface IProps {
  identification: number;
}

interface IForm {
  createCustomerDto: {
    name: string;
    telephoneNumber: string;
  };
  createOrderDto: {
    orderType: number;
    disCount: number;
    giveMoney: number;
    description: string;
  };
  createOrderDetailDtos: {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    measureId: number;
    measureName: string;
    discount: number;
    mor: string;
    noon: string;
    night: string;
    description: string;
  }[];
}

const getCells = (): Cells<ISearchProduct> => [
  { id: 'productId', label: 'STT' },
  { id: 'productName', label: 'Tên sản phẩm' },
  { id: 'mesureNameLevelFirst', label: 'Đơn vị' },
  { id: 'quantity', label: 'Số lượng' },
  { id: 'price', label: 'Đơn giá' },
  { id: 'discount', label: 'Chiết khấu' },
  { id: 'stockQuantity', label: 'Thành tiền' },
  { id: 'routeOfUse', label: 'Liều dùng' },
];

const OrderProductForm = ({ identification }: IProps) => {
  const cells = useMemo(() => getCells(), []);
  const { productSales } = useSelector((state: RootState) => state.salesOrder);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<FilterParams>({
    ...defaultFilters,
    pageSize: 1000,
  });
  const { control, setValue, getValues, handleSubmit } = useForm<IForm>({
    mode: 'onChange',
  });

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
    }));
  };

  const { fields, append, remove } = useFieldArray<IForm>({
    control,
    // @ts-ignore
    name: `createOrderDetailDtos`,
  });

  useEffect(() => {
    if (productSales) {
      append(productSales);
      dispatch(addProductSales(null));
    }
  }, [productSales]);

  const onSubmit = async (payload: IForm) => {
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

  return (
    <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
      <FormHeader title="" />
      <FormContent>
        <Grid container sx={{ height: 1 }}>
          <Grid item xs={12} md={9}>
            <TableWrapper sx={{ height: 1 }} component={Paper}>
              <TableContent total={1} loading={false}>
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
                        {fields &&
                          fields.map((item, index) => (
                            <OrderProduct
                              key={index}
                              index={index}
                              control={control}
                              // handleRemove={() => remove(index)}
                              setValue={setValue}
                            />
                          ))}
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </TableContainer>
              </TableContent>
            </TableWrapper>
          </Grid>
          <Grid item xs={12} md={3}>
            <OrderDetail
              control={control}
              setValue={setValue}
              getValues={getValues}
            />
          </Grid>
        </Grid>
      </FormContent>
      <FormFooter>
        <LoadingButton type="submit">THANH TOÁN</LoadingButton>
      </FormFooter>
    </FormPaperGrid>
  );
};

export default OrderProductForm;
