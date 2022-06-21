import { numberFormat } from 'utils/numberFormat';

interface ImportReceipt {
  toTalMoney: number;
  vat: number;
  discountValue: number;
  moneyToPay: number;
  paid: number;
  debts: number;
  description: string;
  pathFile: string;
}

interface IProps {
  control: any;
  setValue: any;
  importReceipt: ImportReceipt | undefined;
}

const TotalBill = ({ control, setValue, importReceipt }: IProps) => {
  return (
    <>
      {importReceipt && (
        <table style={{float:'right'}}>
          <tbody>
            <tr>
              <td>Tổng tiền:</td>
              <td>{numberFormat(importReceipt.toTalMoney)}</td>
            </tr>
            <tr>
              <td>Thuế VAT (%)</td>
              <td>{importReceipt.vat}%</td>
            </tr>
            <tr>
              <td>Chiết khấu (%):</td>
              <td>{importReceipt.discountValue}%</td>
            </tr>
            <tr>
              <td>Tiền cần trả:</td>
              <td>{numberFormat(importReceipt.moneyToPay)}</td>
            </tr>
            <tr>
              <td style={{ paddingRight: '20px' }}>
                <b>Đã thanh toán</b>
              </td>
              <td>{numberFormat(importReceipt.paid)}</td>
            </tr>
            <tr>
              <td>
                <b>Công nợ</b>
              </td>
              <td>{numberFormat(importReceipt.debts)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};

export default TotalBill;
