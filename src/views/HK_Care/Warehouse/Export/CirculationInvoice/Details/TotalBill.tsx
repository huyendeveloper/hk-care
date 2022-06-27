import { useWatch } from 'react-hook-form';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  control: any;
  setValue: any;
  getValues: any;
}

const TotalBill = ({ control, setValue, getValues }: IProps) => {
  const exportWHDetails = useWatch({
    control,
    name: 'exportWHDetails',
  });

  const bill = exportWHDetails
    ? exportWHDetails.reduce(
        // @ts-ignore
        (prev, cur) =>
          prev + (Number(cur?.amount) || 0) * (Number(cur?.importPrice) || 0),
        0
      )
    : 0;

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
