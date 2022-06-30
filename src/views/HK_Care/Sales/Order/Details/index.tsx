import { Paper } from '@mui/material';
import { LoadingScreen } from 'components/common';
import PageWrapperFullwidth from 'components/common/PageWrapperFullwidth';
import { TableWrapper } from 'components/Table';
import { useNotification } from 'hooks';
import { ISalesOrder } from 'interface';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSaleOrder } from 'redux/slices/salesOrder';
import TableData from './TableData';
import OrderInfo from './OrderInfo';

const Details = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<ISalesOrder | null>(null);

  const fetchDataUpdate = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getSaleOrder(id));
    if (error) {
      setNotification({
        error: 'Lỗi!',
      });
      return;
    }

    setOrder(payload.saleOrder);
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchDataUpdate();
    }
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <PageWrapperFullwidth title="Chi tiết đơn hàng">
      <OrderInfo order={order} />
      <TableData orderDetailDtos={order?.orderDetailDtos || []} />
    </PageWrapperFullwidth>
  );
};

export default Details;
