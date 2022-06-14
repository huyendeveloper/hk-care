import { TableCell, TableRow } from '@mui/material';
import { defaultFilters } from 'constants/defaultFilters';
import { IReceipt } from 'interface';
import DateFns from 'utils/DateFns';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  item: any;
  index: number;
  value: IReceipt;
}

const ReceiptEntity = ({ item, index, value }: IProps) => {
  const { productId } = item;

  return (
    <TableRow hover tabIndex={-1} key={productId}>
      <TableCell>
        {(defaultFilters.pageIndex - 1) * defaultFilters.pageSize + index + 1}
      </TableCell>
      <TableCell>{value.name}</TableCell>
      <TableCell sx={{ width: '130px' }}>{value.measure}</TableCell>
      <TableCell sx={{ width: '130px' }}>{value.amount}</TableCell>
      <TableCell sx={{ width: '130px' }}>
        {numberFormat(value.importPrice)}
      </TableCell>
      <TableCell sx={{ width: '130px' }}>{numberFormat(value.price)}</TableCell>
      <TableCell sx={{ width: '130px' }}>
        {numberFormat(value?.discount || 0)}
      </TableCell>
      <TableCell>{numberFormat(value.totalMoney)}</TableCell>

      <TableCell sx={{ width: '130px' }}>{value?.lotNumber || ''}</TableCell>
      <TableCell sx={{ width: '130px' }}>
        {value?.numberRegister || ''}
      </TableCell>
      <TableCell sx={{ width: '185px' }}>
        {DateFns.formatDate(value.dateManufacture)}
      </TableCell>
      <TableCell sx={{ width: '185px' }}>
        {DateFns.formatDate(value.outOfDate)}
      </TableCell>
    </TableRow>
  );
};

export default ReceiptEntity;
