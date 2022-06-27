import { yupResolver } from '@hookform/resolvers/yup';
import { TabContext, TabPanel } from '@mui/lab';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addProductSales, getSaleOrder, updateOrderSales } from 'redux/slices/salesOrder';
import { RootState } from 'redux/store';
import { Header } from '../components';
import OrderProductForm from './OrderProductForm';
import * as yup from 'yup';
import { useNotification } from 'hooks';

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
    measureListDtos: { id: number; name: string; price: number }[];
  }[];
}

const Create = () => {
  const { id } = useParams();
  const setNotification = useNotification();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>('0');
  const [ids, setIds] = useState<number[]>([1]);
  const { orderSales } = useSelector((state: RootState) => state.salesOrder);

  const { control, setValue, getValues, handleSubmit, reset } = useForm<IForm>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const handleSaveCurrentTab = async (newTab: string) => {
    dispatch(updateOrderSales({ id: ids[Number(tab)], ...getValues() }));

    const orderSale = orderSales.find((x) => x.id === ids[Number(newTab)]);
    getValues('disCount');
    setValue('disCount', orderSale?.disCount || 0);
    setValue('giveMoney', orderSale?.giveMoney || 0);
    setValue('description', orderSale?.description || '');
    // setValue('createOrderDetailDtos', orderSale?.createOrderDetailDtos || []);
  };

  const handleAddTab = () => {
    setIds([...ids, ids[ids.length - 1] + 1]);

    handleSaveCurrentTab(ids.length.toString());
    setTab(ids.length.toString());
  };

  const handleRemoveTab = (index: number) => {
    const newIds = [...ids];
    newIds.splice(index, 1);
    if (newIds.length === 0) {
      return navigate('/hk_care/sales/order');
    }
    setIds(newIds);
    handleSaveCurrentTab('0');
    setTab('0');
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    handleSaveCurrentTab(newValue);
    setTab(newValue);
  };

  const addItem = (item: any) => {
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
    const {
      
    } = payload.saleOrder;
    console.log('payload.saleOrder', payload.saleOrder)

    // reset({
    //   totalFee,
    //   code,
    //   description,
    //   from,
    //   to,
    //   rotationPoint,
    //   exportWHDetails,
    // });
  };

  useEffect(() => {
    if (id) {
      fetchDataUpdate();
    }
  }, []);

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
              <TabPanel value={index.toString()} sx={{ height: '100vh' }}>
                <OrderProductForm
                  identification={item}
                  control={control}
                  setValue={setValue}
                  getValues={getValues}
                  handleSubmit={handleSubmit}
                />
              </TabPanel>
            </React.Fragment>
          );
        })}
      </TabContext>
    </Fragment>
  );
};

export default Create;
