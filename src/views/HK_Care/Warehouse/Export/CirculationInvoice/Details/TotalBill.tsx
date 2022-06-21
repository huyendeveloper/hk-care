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
        <table style={{ float: 'right' }}>
          <tbody>
            <tr>
              <td>Tổng giá trị hủy:</td>
              <td>{numberFormat(importReceipt.toTalMoney)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};

export default TotalBill;
