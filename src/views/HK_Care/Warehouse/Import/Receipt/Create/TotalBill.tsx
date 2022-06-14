import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import React from 'react';
import { useWatch } from 'react-hook-form';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  control: any;
  setValue: any;
  getValues: any;
}

const TotalBill = ({ control, setValue, getValues }: IProps) => {
  const productReceiptWHDtos = useWatch({
    control,
    name: 'productReceiptWHDtos',
  });
  const vat = useWatch({ control, name: 'vat' }) || 0;
  const discountValue = useWatch({ control, name: 'discountValue' }) || 0;
  const paid = useWatch({ control, name: 'paid' }) || 0;

  const bill = productReceiptWHDtos
    ? productReceiptWHDtos.reduce(
        // @ts-ignore
        (prev, cur) =>
          prev +
          (Number(cur?.amount) || 0) * (Number(cur?.importPrice) || 0) -
          (Number(cur?.discount) || 0),
        0
      )
    : 0;

  const moneyToPay = bill + bill * (vat / 100) - bill * (discountValue / 100);

  const debts = moneyToPay - paid;

  return (
    <table>
      <tbody>
        <tr>
          <td>Tổng tiền:</td>
          <td>{numberFormat(bill)}</td>
        </tr>
        <tr>
          <td>Thuế VAT (%)</td>
          <td>
            <ControllerNumberInput
              name="vat"
              variant="standard"
              setValue={setValue}
              type="percent"
              defaultValue={getValues(`vat`)}
            />
          </td>
        </tr>
        <tr>
          <td>Chiết khấu (%):</td>
          <td>
            <ControllerNumberInput
              name="discountValue"
              variant="standard"
              setValue={setValue}
              type="percent"
              defaultValue={getValues(`discountValue`)}
            />
          </td>
        </tr>
        <tr>
          <td>Tiền cần trả:</td>
          <td>{numberFormat(moneyToPay)}</td>
        </tr>
        <tr>
          <td style={{ paddingRight: '20px' }}>
            <b>Đã thanh toán</b>
          </td>
          <td>
            <ControllerNumberInput
              name="paid"
              variant="standard"
              setValue={setValue}
              defaultValue={getValues(`paid`)}
            />
          </td>
        </tr>
        <tr>
          <td>
            <b>Công nợ</b>
          </td>
          <td>{numberFormat(debts)}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TotalBill;
