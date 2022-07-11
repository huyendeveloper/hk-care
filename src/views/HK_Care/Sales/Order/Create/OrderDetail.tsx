import { Stack } from '@mui/material';
import { ControllerTextarea } from 'components/Form';
import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  control: any;
  setValue: any;
  getValues: any;
}

const OrderDetail = ({ control, setValue, getValues }: IProps) => {
  const createOrderDetailDtos = useWatch({
    control,
    name: 'createOrderDetailDtos',
  });

  const bill = createOrderDetailDtos
    ? createOrderDetailDtos.reduce(
        // @ts-ignore
        (prev, cur) => prev + (Number(cur?.billPerProduct) || 0),
        0
      )
    : 0;
  const discountValue = useWatch({ control, name: 'disCount' }) || 0;
  const paid = useWatch({ control, name: 'giveMoney' }) || 0;
  const moneyToPay = useWatch({ control, name: 'moneyToPay' }) || 0;

  useEffect(() => {
    setValue('moneyToPay', bill - (discountValue / 100) * bill || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bill, discountValue]);

  return (
    <Stack p={2} gap={2}>
      <Stack flexDirection="row" justifyContent="space-between">
        <div>Loại hóa đơn</div>
        <div>Khách bán lẻ</div>
      </Stack>
      <Stack flexDirection="row" justifyContent="space-between">
        <div>Tổng tiền: ({createOrderDetailDtos?.length || 0} sản phẩm)</div>
        <div>{numberFormat(bill)}</div>
      </Stack>
      <Stack flexDirection="row" justifyContent="space-between">
        <div>Chiết khấu (%)</div>
        <div>
          <ControllerNumberInput
            name="disCount"
            variant="standard"
            setValue={setValue}
            type="percent"
            value={getValues(`disCount`)}
            control={control}
            inputProps={{ style: { textAlign: 'right' } }}
          />
        </div>
      </Stack>
      <Stack flexDirection="row" justifyContent="space-between">
        <b>KHÁCH PHẢI TRẢ</b>
        <div>{numberFormat(moneyToPay)}</div>
      </Stack>
      <hr style={{ width: '100%' }} />
      <Stack flexDirection="row" justifyContent="space-between">
        <b>Tiền khách đưa</b>
      </Stack>
      <Stack flexDirection="row" justifyContent="space-between">
        <b>Tiền mặt</b>
        <div>
          <ControllerNumberInput
            name="giveMoney"
            variant="standard"
            setValue={setValue}
            control={control}
            value={getValues('giveMoney')}
            inputProps={{ style: { textAlign: 'right' } }}
          />
        </div>
      </Stack>
      <hr style={{ width: '100%' }} />
      <Stack flexDirection="row" justifyContent="space-between">
        <b>Tiền thừa trả khách</b>
        <div>
          {numberFormat(
            paid - (bill - ((getValues(`disCount`) || 0) / 100) * bill)
          )}
        </div>
      </Stack>
      <b>Ghi chú</b>

      <ControllerTextarea
        maxRows={5}
        minRows={5}
        name="description"
        control={control}
      />
    </Stack>
  );
};

export default OrderDetail;
