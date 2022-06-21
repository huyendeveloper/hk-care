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
    <table style={{ float: 'right' }}>
      <tbody>
        <tr>
          <td>Tổng giá trị xuất:</td>
          <td>{numberFormat(bill)}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TotalBill;
