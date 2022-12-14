import PrintIcon from '@mui/icons-material/Print';
import StarIcon from '@mui/icons-material/Star';
import { Box, IconButton, Stack } from '@mui/material';
import { LoadingScreen } from 'components/common';
import { useNotification } from 'hooks';
import { ISalesOrder } from 'interface';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import { getSaleOrder } from 'redux/slices/salesOrder';
import LocalStorage from 'utils/LocalStorage';
import { numberFormat } from 'utils/numberFormat';
// @ts-ignore
import Print from './print';

const PrintOrder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<ISalesOrder | null>(null);

  const [refs, setRefs] = useState();

  const handlePrint = () => {
    Print('#retroReport');
  };

  const fetchDataUpdate = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getSaleOrder(id));
    if (error) {
      setNotification({
        error: 'Hệ thống đang gặp sự cố',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <Helmet>
        <title>In hoá đơn</title>
      </Helmet>
      <div>
        <Stack
          sx={{
            minHeight: '100vh',
            background: '#137b3e',
            position: 'relative',
          }}
          justifyContent="space-around"
          flexDirection="row"
          className="print"
        >
          <ReactToPrint
            trigger={() => (
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  background: 'white',
                }}
                onClick={handlePrint}
              >
                <PrintIcon />
              </IconButton>
            )}
            // @ts-ignore
            content={() => refs}
          />

          <Box
            sx={{
              width: '8cm',
              background: 'white',
              right: '50%',
              minHeight: '100vh',
              color: 'black',
            }}
            id="retroReport"
            // @ts-ignore
            ref={(el) => setRefs(el)}
          >
            <Box sx={{ padding: '30px 10px' }}>
              <Stack
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <div>
                  <Box
                    component="img"
                    sx={{
                      width: '3cm',
                    }}
                    src="/static/logo.png"
                  />
                  <h5 style={{ margin: 0 }}>HỆ THỐNG HK CARE</h5>
                </div>
                <Box sx={{ textAlign: 'right', fontSize: '12px' }}>
                  <Box sx={{ whiteSpace: 'no-wrap' }}>
                    {LocalStorage.get('tennant')}
                  </Box>
                  <div>Địa chỉ: {order?.tenantAddress}</div>
                  <Box>Điện thoại: {order?.tenantPhone}</Box>
                </Box>
              </Stack>

              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <h6 style={{ fontSize: '13px', margin: 0 }}>
                  HÓA ĐƠN BÁN HÀNG
                </h6>
                (Ngày {moment(order?.saleDate).format('DD/MM/YYYY')})
              </Box>
              <Stack flexDirection="row" mb={2} justifyContent="space-between">
                <div>
                  BH: <b>{order?.name}</b>
                </div>
                <div>
                  Mã HĐ: <b>{order?.code}</b>
                </div>
              </Stack>
              <table style={{ marginBottom: '20px', width: '100%' }}>
                <thead>
                  <tr>
                    <td colSpan={5} style={{ padding: '0' }}>
                      <hr style={{ borderTop: '1px solid black', margin: 0 }} />
                    </td>
                  </tr>
                  <tr>
                    <td>Sản phẩm</td>
                    {/* <td style={{ padding: '2px' }}>Đ.Vị</td> */}
                    <td style={{ padding: '2px' }}>SL</td>
                    <td style={{ padding: '2px' }}>Đ.Giá</td>
                    <td style={{ padding: '2px' }}>C.Khấu</td>
                    <td>T.Tiền</td>
                  </tr>
                  <tr>
                    <td colSpan={5} style={{ padding: '0' }}>
                      <hr style={{ borderTop: '1px solid black', margin: 0 }} />
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {order &&
                    order?.orderDetailDtos.map((item) => (
                      <>
                        <tr>
                          <td>{item.productName}</td>
                          {/* <td style={{ padding: '2px' }}>{item.measureName}</td> */}
                          <td style={{ padding: '2px', textAlign: 'center' }}>
                            {item.quantity}
                          </td>
                          <td style={{ padding: '2px' }}>
                            {numberFormat(item.price)}
                          </td>
                          <td style={{ padding: '2px' }}>{item.discount}</td>
                          <td>
                            {numberFormat(
                              item.quantity * item.price - item.discount
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={6}>
                            <em>
                              (Sáng: {item.mor || '......'}, Trưa:{' '}
                              {item.noon || '......'}, Tối:{' '}
                              {item.night || '......'}, Ghi chú:{' '}
                              {item.description ||
                                '........................................................'}
                              )
                            </em>
                          </td>
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>

              <hr style={{ borderTop: '1px dashed black' }} />
              <div
                style={{ width: '6cm', marginLeft: 'auto', padding: '10px' }}
              >
                <Stack
                  flexDirection="row"
                  justifyContent="space-between"
                  flexWrap="wrap"
                >
                  <div>Chiết khấu(%):</div>
                  <div>{order?.disCount || 0}</div>
                </Stack>
                <Stack
                  flexDirection="row"
                  justifyContent="space-between"
                  flexWrap="wrap"
                >
                  <i>KHÁCH PHẢI TRẢ:</i>
                  <div>
                    {numberFormat(
                      (order?.orderDetailDtos
                        ? order?.orderDetailDtos.reduce(
                            // @ts-ignore
                            (prev, cur) =>
                              prev +
                              (Number(
                                (cur.quantity || 0) * cur.price -
                                  (cur.discount || 0)
                              ) || 0),
                            0
                          )
                        : 0) -
                        ((order?.disCount ?? 0) / 100) *
                          (order?.orderDetailDtos
                            ? order?.orderDetailDtos.reduce(
                                // @ts-ignore
                                (prev, cur) =>
                                  prev +
                                  (Number(
                                    (cur.quantity || 0) * cur.price -
                                      (cur.discount || 0)
                                  ) || 0),
                                0
                              )
                            : 0)
                    )}
                  </div>
                </Stack>
                <div>Tiền khách đưa:</div>
                <Stack
                  flexDirection="row"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  sx={{ borderBottom: '1px dashed black' }}
                >
                  <div>Tiền mặt</div>
                  <div>{numberFormat(order?.giveMoney || 0)}</div>
                </Stack>
                <Stack
                  flexDirection="row"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  mt={1}
                >
                  <div>Tiền thừa trả khách:</div>
                  <div>
                    {numberFormat(
                      (order?.giveMoney || 0) -
                        ((order?.orderDetailDtos
                          ? order?.orderDetailDtos.reduce(
                              // @ts-ignore
                              (prev, cur) =>
                                prev +
                                (Number(
                                  (cur.quantity || 0) * cur.price -
                                    (cur.discount || 0)
                                ) || 0),
                              0
                            )
                          : 0) -
                          ((order?.disCount ?? 0) / 100) *
                            (order?.orderDetailDtos
                              ? order?.orderDetailDtos.reduce(
                                  // @ts-ignore
                                  (prev, cur) =>
                                    prev +
                                    (Number(
                                      (cur.quantity || 0) * cur.price -
                                        (cur.discount || 0)
                                    ) || 0),
                                  0
                                )
                              : 0))
                    )}
                  </div>
                </Stack>
              </div>
              <hr style={{ borderTop: '1px dashed black' }} />
              <Stack
                flexDirection="row"
                justifyContent="space-between"
                flexWrap="wrap"
                mt={1}
                mb={1}
              >
                <b>Quý khách tiết kiệm được:</b>
                <b>{numberFormat(order?.discountValue || 0)}</b>
              </Stack>
              <hr
                style={{ borderTop: '1px dashed black', marginBottom: '10px' }}
              />
              <Stack flexDirection="row" mb={2} justifyContent="center" gap={1}>
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </Stack>
              <div>
                Quý khách được đổi trả hàng khi hàng hóa nguyên vẹn, không hư
                hỏng.
              </div>
              <div>Mọi thắc mắc quý khách liên hệ tổng đài:</div>
              <b>0337 664 222</b>
            </Box>
          </Box>
        </Stack>
      </div>
    </Fragment>
  );
};

export default PrintOrder;
