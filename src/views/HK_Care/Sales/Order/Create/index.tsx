import { TabContext, TabPanel } from '@mui/lab';
import React, { Fragment, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addProductSales } from 'redux/slices/salesOrder';
import { Header } from '../components';
import OrderProductForm from './OrderProductForm';

const Create = () => {
  const [tab, setTab] = useState<string>('0');
  const [ids, setIds] = useState<number[]>([1]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddTab = () => {
    setIds([...ids, ids[ids.length - 1] + 1]);
    setTab(ids.length.toString());
  };

  const handleRemoveTab = (index: number) => {
    const newIds = [...ids];
    newIds.splice(index, 1);
    if (newIds.length === 0) {
      return navigate('/hk_care/sales/order');
    }
    setIds(newIds);
    setTab('0');
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const addItem = (item: any) => {
    dispatch(addProductSales(item));
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
              <TabPanel value={index.toString()} sx={{ height: '100vh' }}>
                <OrderProductForm identification={item} />
              </TabPanel>
            </React.Fragment>
          );
        })}
      </TabContext>
    </Fragment>
  );
};

export default Create;
