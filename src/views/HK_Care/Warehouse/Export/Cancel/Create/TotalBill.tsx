import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  control: any;
}

const TotalBill = ({ control }: IProps) => {
  const exportWHDetails = useWatch({
    control,
    name: 'exportWHDetails',
  });

  const bill = useMemo(
    () =>
      exportWHDetails
        ? exportWHDetails.reduce(
            // @ts-ignore
            (prev, cur) =>
              prev +
              (Number(cur?.amount) || 0) * (Number(cur?.importPrice) || 0),
            0
          )
        : 0,
    [exportWHDetails]
  );

  return (
    <table style={{ float: 'right' }}>
      <tbody>
        <tr>
          <td>Tổng giá trị hủy:</td>
          <td>{numberFormat(bill)}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TotalBill;
