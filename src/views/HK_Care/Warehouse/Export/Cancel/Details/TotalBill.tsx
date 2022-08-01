import { IExportCancel } from 'interface';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  exportCancel: IExportCancel | undefined;
}

const TotalBill = ({ exportCancel }: IProps) => {
  return (
    <>
      {exportCancel && (
        <table style={{ float: 'right' }}>
          <tbody>
            <tr>
              <td>Tổng giá trị hủy:</td>
              <td>{numberFormat(exportCancel.totalFee)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};

export default TotalBill;
