import { yupResolver } from '@hookform/resolvers/yup';
import { TabContext, TabPanel } from '@mui/lab';
import { DeleteDialog } from 'components/Dialog';
import { useNotification } from 'hooks';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addProductSales,
  getSaleOrder,
  updateOrderSales,
} from 'redux/slices/salesOrder';
import { RootState } from 'redux/store';
import * as yup from 'yup';
import { Header } from '../components';
import OrderProductForm from './OrderProductForm';

const validationSchema = yup.object().shape({
  disCount: yup.number().default(0),
});

interface IForm {
  name: string;
  telephoneNumber: string;
  orderType: number;
  disCount: number;
  giveMoney: number;
  description: string;
  moneyToPay: number;
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
    measureListDtos?: { id: number; name: string; price: number }[];
  }[];
}

const Create = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setNotification = useNotification();
  const [tab, setTab] = useState<string>('0');
  const [ids, setIds] = useState<number[]>([1]);
  const { orderSales } = useSelector((state: RootState) => state.salesOrder);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const { control, setValue, getValues, handleSubmit, reset } = useForm<IForm>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const handleSaveCurrentTab = async (newTab: string) => {
    dispatch(updateOrderSales({ id: ids[Number(tab)], ...getValues() }));
    const orderSale = orderSales.find((x) => x.id === ids[Number(newTab)]);
    setValue('disCount', orderSale?.disCount || 0);
    setValue('giveMoney', orderSale?.giveMoney || 0);
    setValue('description', orderSale?.description || '');
    setValue('moneyToPay', orderSale?.moneyToPay || 0);
    setValue('createOrderDetailDtos', orderSale?.createOrderDetailDtos || []);
  };

  const handleAddTab = async () => {
    setIds([...ids, ids[ids.length - 1] + 1]);

    dispatch(
      updateOrderSales({
        id: ids[ids.length - 1] + 1,
        disCount: 0,
        giveMoney: 0,
        description: '',
        moneyToPay: 0,
        createOrderDetailDtos: [],
      })
    );

    handleSaveCurrentTab(ids.length.toString());
    setTab(ids.length.toString());
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    handleSaveCurrentTab(newValue);
    setTab(newValue);
  };

  const handleRemoveTab = (index: number) => {
    setOpenDeleteDialog(true);
  };

  const addItem = (item: any) => {
    if (item.stockQuantity < 1) {
      setNotification({
        error: 'Sản phẩm này hiện tại hết hàng!',
      });
      return;
    }
    dispatch(addProductSales(item));
  };

  const fetchDataUpdate = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getSaleOrder(id));
    if (error) {
      setNotification({
        error: 'Lỗi!',
      });
      return;
    }
    const { disCount, orderDetailDtos, description, giveMoney } =
      payload.saleOrder;

    reset({
      disCount,
      createOrderDetailDtos: orderDetailDtos,
      moneyToPay: giveMoney,
      description,
    });
  };

  useEffect(() => {
    if (id) {
      fetchDataUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    if (!tab) return;

    handleCloseDeleteDialog();
    const newIds = [...ids];
    newIds.splice(Number(tab), 1);
    if (newIds.length === 0) {
      return navigate('/hk_care/sales/order');
    }
    setIds(newIds);
    setTab('0');
    const orderSale = orderSales.find((x) => x.id === ids[Number('0')]);
    setValue('disCount', orderSale?.disCount || 0);
    setValue('moneyToPay', orderSale?.moneyToPay || 0);
    setValue('giveMoney', orderSale?.giveMoney || 0);
    setValue('description', orderSale?.description || '');
    setValue('createOrderDetailDtos', orderSale?.createOrderDetailDtos || []);
  };

  return (
    <Fragment>
      <Helmet>
        <title>Tạo hóa đơn bán hàng</title>
      </Helmet>
      <TabContext value={tab}>
        <Header
          tab={tab}
          ids={ids}
          handleAddTab={handleAddTab}
          handleRemoveTab={handleRemoveTab}
          handleChange={handleChange}
          addItem={addItem}
        />
        {ids.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <TabPanel value={index.toString()}>
                <OrderProductForm
                  identification={item}
                  control={control}
                  setValue={setValue}
                  getValues={getValues}
                  handleSubmit={handleSubmit}
                  handleDelete={handleDelete}
                />
              </TabPanel>
            </React.Fragment>
          );
        })}
      </TabContext>
      <DeleteDialog
        id={tab}
        tableName="đơn hàng"
        name={ids[Number(tab)]?.toString() || ''}
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        handleDelete={handleDelete}
        type="Đóng"
      />
    </Fragment>
  );
};

export default Create;
