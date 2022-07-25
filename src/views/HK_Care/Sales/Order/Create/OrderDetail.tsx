import AddIcon from '@mui/icons-material/Add';
import { Box, IconButton, Stack } from '@mui/material';
import { LinkIconButton } from 'components/common';
import { ControllerTextarea, EntitySelecter } from 'components/Form';
import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import { useEffect, useMemo } from 'react';
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

  const bill = useMemo(
    () =>
      createOrderDetailDtos
        ? createOrderDetailDtos.reduce(
            // @ts-ignore
            (prev, cur) => prev + (Number(cur?.billPerProduct) || 0),
            0
          )
        : 0,
    [createOrderDetailDtos]
  );
  const discountValue = useWatch({ control, name: 'disCount' }) || 0;
  const paid = useWatch({ control, name: 'giveMoney' }) || 0;
  const moneyToPay = useWatch({ control, name: 'moneyToPay' }) || 0;

  const selectOrderTypeOptions = useMemo(
    () => [
      { id: 1, name: 'Khách bán lẻ' },
      { id: 2, name: 'Bán theo kê đơn bác sĩ' },
    ],
    []
  );

  const mockCustomers = useMemo(
    () => [
      { id: 1, name: 'Nguyễn Thu Hà', phone: '0987654321' },
      { id: 2, name: 'Tô Thanh Minh', phone: '0987654321' },
    ],
    []
  );

  useEffect(() => {
    setValue('moneyToPay', bill - (discountValue / 100) * bill || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bill, discountValue]);

  return (
    <Stack p={2} gap={2}>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box sx={{ width: '87%' }}>
          <EntitySelecter
            name="customer"
            control={control}
            options={mockCustomers}
            renderLabel={(field) => field.name}
            renderValue="id"
            moreInfor="phone"
            placeholder=""
            disableClearable
          />
        </Box>
        <LinkIconButton target="_blank" to="/add-customer">
          <IconButton>
            <AddIcon />
          </IconButton>
        </LinkIconButton>
      </Stack>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <div>Loại hóa đơn</div>
        <Box sx={{ width: '60%' }}>
          <EntitySelecter
            name="orderType"
            control={control}
            options={selectOrderTypeOptions}
            renderLabel={(field) => field.name}
            renderValue="id"
            placeholder=""
            disableClearable
          />
        </Box>
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
        <b>Tiền khách đưa</b>{' '}
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
      <Stack flexDirection="row" justifyContent="space-between">
        <div>Tiền mặt</div>
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
