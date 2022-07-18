import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  control: any;
  index: number;
}

const TotalBill = ({ control, index }: IProps) => {
  const results = useWatch({ control, name: 'productReceiptWHDtos' });

  const item = useMemo(() => results[index], [index, results]);

  const bill = useMemo(
    () =>
      (Number(item?.amount) || 0) * (Number(item?.importPrice) || 0) -
      (Number(item?.discount) || 0),
    [item?.amount, item?.discount, item?.importPrice]
  );

  return <>{numberFormat(bill < 0 ? 0 : bill)}</>;
};

export default TotalBill;
