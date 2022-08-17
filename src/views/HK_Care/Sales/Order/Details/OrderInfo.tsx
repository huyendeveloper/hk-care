import {
  Grid,
  IconButton,
  Paper,
  Stack,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import { TableWrapper } from 'components/Table';
import { ISalesOrder } from 'interface';
import formatDateTime from 'utils/dateTimeFormat';
import { numberFormat } from 'utils/numberFormat';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useMemo, useState } from 'react';
import MapDialog from '../Create/PreviewImagesDialog';

interface IProps {
  order: ISalesOrder | null;
}

const OrderInfo = ({ order }: IProps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const files = useMemo(() => order?.images || [], []);
  const [previewImages, setPreviewImages] = useState<boolean>(false);

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
            Khách hàng: <b>Nhân viên bán hàng</b> - <b>0123456789</b>
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
              <td>
                {order?.orderType === 1
                  ? 'Khách bán lẻ'
                  : 'Bán theo đơn bác sĩ'}
              </td>
            </tr>
            <tr>
              <td>Bán bởi:</td>
              <td>Nhân viên bán hàng</td>
            </tr>
            <tr>
              <td>Ngày bán:</td>
              <td>{formatDateTime(order?.saleDate)}</td>
            </tr>
            {order?.orderType === 2 && files.length > 0 && (
              <tr>
                <td>Hình ảnh chi tiết:</td>
                <td>
                  <IconButton onClick={() => setPreviewImages(true)}>
                    <RemoveRedEyeIcon />
                  </IconButton>
                </td>
              </tr>
            )}
          </table>
          <hr />
          <Typography variant="h5">Ghi chú</Typography>
          <TextareaAutosize
            minRows={11}
            style={{ width: '100%' }}
            value={order?.description || ''}
            disabled
          />
        </TableWrapper>
      </Grid>
      <MapDialog
        open={previewImages}
        onClose={() => setPreviewImages(false)}
        images={files || []}
      />
    </Grid>
  );
};

export default OrderInfo;
