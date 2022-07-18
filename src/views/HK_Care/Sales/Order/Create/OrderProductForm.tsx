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
import {
  FormContent,
  FormFooter,
  FormHeader,
  FormPaperGrid,
} from 'components/Form';
import { TableContent, TableHeader, TableWrapper } from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { ISearchProduct, OrderSales } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addProductSales,
  createSalesOrder,
  updateSalesOrder,
} from 'redux/slices/salesOrder';
import { RootState } from 'redux/store';
import { FilterParams } from 'types';
import OrderDetail from './OrderDetail';
import OrderProduct from './OrderProduct';

interface IProps {
  identification: number;
  control: any;
  handleSubmit: any;
  setValue: any;
  getValues: any;
  handleDelete: () => void;
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
    billPerProduct: number;
  }[];
}

const getCells = (): Cells<ISearchProduct> => [
  { id: 'productId', label: 'STT' },
  { id: 'productName', label: 'Tên sản phẩm' },
  { id: 'mesureNameLevelFirst', label: 'Đơn vị' },
  { id: 'quantity', label: 'SL' },
  { id: 'price', label: 'Đơn giá' },
  { id: 'discount', label: 'Chiết khấu' },
  { id: 'stockQuantity', label: 'Thành tiền' },
  { id: 'routeOfUse', label: 'Liều dùng' },
];

const OrderProductForm = ({
  identification,
  control,
  handleSubmit,
  getValues,
  setValue,
  handleDelete,
}: IProps) => {
  const { id } = useParams();
  const cells = useMemo(() => getCells(), []);
  const setNotification = useNotification();
  const navigate = useNavigate();
  const { productSales } = useSelector((state: RootState) => state.salesOrder);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<FilterParams>({
    ...defaultFilters,
    pageSize: 1000,
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
      append({
        ...productSales,
        // @ts-ignore
        measureId:
          // @ts-ignore
          productSales.measureListDtos.length > 0
            ? // @ts-ignore
              productSales.measureListDtos[0].id
            : null,
      });
      dispatch(addProductSales(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSales]);

  const onSubmit = async (body: OrderSales) => {
    if (body.createOrderDetailDtos.length < 1) {
      setNotification({ error: 'Bạn chưa chọn sản phẩm nào!' });
      return;
    }
    if (id) {
      const { error } = await dispatch(
        // @ts-ignore
        updateSalesOrder({ ...body, orderId: id })
      );
      if (error) {
        setNotification({ error: 'Lỗi!' });
        return;
      }
      setNotification({
        message: 'Cập nhật thành công',
        severity: 'success',
      });
      window.open(`/hk_care/sales/order/${id}/print`);
      return navigate(`/hk_care/sales/order`);
    } else {
      const { error, payload } = await dispatch(
        // @ts-ignore
        createSalesOrder(body)
      );
      if (error) {
        setNotification({ error: 'Lỗi!' });
        return;
      }
      setNotification({
        message: 'Tạo hóa đơn thành công',
        severity: 'success',
      });
      if (payload.id) {
        window.open(`/hk_care/sales/order/${payload.id}/print`);
      }
      handleDelete();
    }
  };

  return (
    <FormPaperGrid
      height="fit-content"
      style={{ margin: '-24px', height: 'calc(100vh - 58px)' }}
      onSubmit={handleSubmit(onSubmit)}
      gridTemplateRows="1fr"
    >
      <FormHeader title="" hidden />
      <FormContent>
        <Grid container sx={{ height: 1 }}>
          <Grid item xs={12} md={9}>
            <TableWrapper
              sx={{ height: 'calc(100vh - 98px)' }}
              component={Paper}
            >
              <TableContent total={1} loading={false}>
                <TableContainer
                  sx={{ p: 1.5, maxHeight: 'calc(100vh - 98px)' }}
                >
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
                              handleRemove={() => remove(index)}
                              setValue={setValue}
                              getValues={getValues}
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
            <Stack p={2} gap={2} flexDirection="row" justifyContent="flex-end">
              {id && <LinkButton to="/hk_care/sales/order">Hủy</LinkButton>}
              <LoadingButton
                type="submit"
                sx={id ? {} : { fontSize: '28px', width: '100%' }}
              >
                {id ? 'Lưu' : 'Thanh toán'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </FormContent>
      <FormFooter hidden></FormFooter>
    </FormPaperGrid>
  );
};

export default OrderProductForm;
