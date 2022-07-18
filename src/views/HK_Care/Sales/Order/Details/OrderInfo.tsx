import {
  Grid,
  Paper,
  Stack,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import { TableWrapper } from 'components/Table';
import { ISalesOrder } from 'interface';
import formatDateTime from 'utils/dateTimeFormat';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  order: ISalesOrder | null;
}

const OrderInfo = ({ order }: IProps) => {
  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{ display: 'flex', gap: '20px', flexDirection: 'column' }}
      >
        <TableWrapper
          sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: '10px' }}
          component={Paper}
        >
          <Typography variant="h5">Thông tin khách hàng</Typography>
          <div>
            Khách hàng: <b>Nguyễn Thu Trang</b> - <b>0123456789</b>
          </div>
        </TableWrapper>
        <TableWrapper
          sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: '10px' }}
          component={Paper}
        >
          <Typography variant="h5">Thông tin thanh toán</Typography>
          <Stack flexDirection="row" justifyContent="space-between">
            <div>
              Tổng tiền: (<b>{order?.orderDetailDtos?.length || 0}</b> sản phẩm)
            </div>
            <div>
              {numberFormat(
                order?.orderDetailDtos
                  ? order?.orderDetailDtos.reduce(
                      // @ts-ignore
                      (prev, cur) =>
                        prev +
                        (Number(
                          (cur.quantity || 0) * cur.price - (cur.discount || 0)
                        ) || 0),
                      0
                    )
                  : 0
              )}
            </div>
          </Stack>
          <Stack flexDirection="row" justifyContent="space-between">
            <div>Chiết khấu (%)</div>
            <div>{order?.disCount ?? 0}</div>
          </Stack>
          <Stack flexDirection="row" justifyContent="space-between">
            <b>KHÁCH PHẢI TRẢ</b>
            <div>
              {numberFormat(
                (order?.orderDetailDtos
                  ? order?.orderDetailDtos.reduce(
                      // @ts-ignore
                      (prev, cur) =>
                        prev +
                        (Number(
                          (cur.quantity || 0) * cur.price - (cur.discount || 0)
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
          <hr style={{ width: '100%' }} />
          <Stack flexDirection="row" justifyContent="space-between">
            <b>Tiền khách đưa</b>
          </Stack>
          <Stack flexDirection="row" justifyContent="space-between">
            <div>Tiền mặt</div>
            <div>{numberFormat(order?.giveMoney || 0)}</div>
          </Stack>{' '}
          <hr style={{ width: '100%' }} />
          <Stack flexDirection="row" justifyContent="space-between">
            <b>Tiền thừa trả khách</b>
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
        </TableWrapper>
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        sx={{ display: 'flex', gap: '20px', flexDirection: 'column' }}
      >
        <TableWrapper
          sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: '10px' }}
          component={Paper}
        >
          <Typography variant="h5">Thông tin hóa đơn</Typography>
          <table>
            <tr>
              <td>Loại hóa đơn:</td>
              <td>Khách bán lẻ</td>
            </tr>
            <tr>
              <td>Bán bởi:</td>
              <td>Nguyễn Thu Trang</td>
            </tr>
            <tr>
              <td>Ngày bán:</td>
              <td>{formatDateTime(order?.saleDate)}</td>
            </tr>
          </table>
          <hr />
          <Typography variant="h5">Ghi chú</Typography>
          <TextareaAutosize
            minRows={11}
            style={{ width: '100%' }}
            value={order?.description || ''}
          />
        </TableWrapper>
      </Grid>
    </Grid>
  );
};

export default OrderInfo;
