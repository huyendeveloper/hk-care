import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import { useEffect, useMemo } from 'react';
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

  const bill = useMemo(() => {
    return productReceiptWHDtos
      ? productReceiptWHDtos.reduce(
          // @ts-ignore
          (prev, cur) =>
            prev +
            (Number(cur?.amount) || 0) * (Number(cur?.importPrice) || 0) -
            (Number(cur?.discount) || 0),
          0
        )
      : 0;
  }, [productReceiptWHDtos]);

  const moneyToPay = useMemo(
    () => bill + bill * (vat / 100) - bill * (discountValue / 100),
    [bill, discountValue, vat]
  );

  const debts = useMemo(() => moneyToPay - paid, [moneyToPay, paid]);

  useEffect(() => {
    setValue('paid', moneyToPay);
  }, [moneyToPay]);

  return (
    <table style={{ float: 'right' }}>
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
              value={getValues(`vat`)}
              control={control}
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
              value={getValues(`discountValue`)}
              control={control}
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
              value={getValues(`paid`)}
              control={control}
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
