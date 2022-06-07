import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import React from 'react';
import { useWatch } from 'react-hook-form';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  control: any;
  setValue: any;
}

const TotalBill = ({ control, setValue }: IProps) => {
  const productList = useWatch({ control, name: 'productList' });
  const vat = useWatch({ control, name: 'vat' }) || 0;
  const discount = useWatch({ control, name: 'discount' }) || 0;
  const paid = useWatch({ control, name: 'paid' }) || 0;

  const bill = productList
    ? productList.reduce(
        // @ts-ignore
        (prev, cur) =>
          prev +
          (Number(cur?.amount) || 0) * (Number(cur?.importPrice) || 0) -
          (Number(cur?.discount) || 0),
        0
      )
    : 0;

  const moneyToPay = bill + bill * (vat / 100) - bill * (discount / 100);

  const debts = moneyToPay - paid;

  return (
    <table>
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
          />
        </td>
      </tr>
      <tr>
        <td>Chiết khấu (%):</td>
        <td>
          <ControllerNumberInput
            name="discount"
            variant="standard"
            setValue={setValue}
            type="percent"
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
          />
        </td>
      </tr>
      <tr>
        <td>
          <b>Công nợ</b>
        </td>
        <td>{numberFormat(debts)}</td>
      </tr>
    </table>
  );
};

export default TotalBill;
