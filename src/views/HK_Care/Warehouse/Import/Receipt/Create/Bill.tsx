import { Box } from '@mui/material';
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

  const bill =
    (Number(item?.amount) || 0) * (Number(item?.importPrice) || 0) -
    (Number(item?.discount) || 0);

  return (
    <Box sx={{ height: '40px', verticalAlign: 'middle', display: 'inherit' }}>
      {numberFormat(bill < 0 ? 0 : bill)}
    </Box>
  );
};

export default TotalBill;
