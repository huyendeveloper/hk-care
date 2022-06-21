import React from 'react';
import { useWatch } from 'react-hook-form';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  control: any;
  index: number;
}

const TotalBill = ({ control, index }: IProps) => {
  const results = useWatch({ control, name: 'exportWHDetails' });

  const item = results[index];

  const bill =
    (Number(item?.amount) || 0) * (Number(item?.importPrice) || 0) -
    (Number(item?.discount) || 0);

  return <>{numberFormat(bill < 0 ? 0 : bill)}</>;
};

export default TotalBill;
