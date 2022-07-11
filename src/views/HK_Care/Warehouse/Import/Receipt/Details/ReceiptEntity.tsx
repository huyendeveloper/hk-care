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
      <TableCell>{value.measure}</TableCell>
      <TableCell>{value.amount}</TableCell>
      <TableCell>{numberFormat(value.importPrice)}</TableCell>
      <TableCell>{numberFormat(value.price)}</TableCell>
      <TableCell>{numberFormat(value?.discount || 0)}</TableCell>
      <TableCell>{numberFormat(value.totalMoney)}</TableCell>

      <TableCell>{value?.lotNumber || ''}</TableCell>
      <TableCell>{value?.numberRegister || ''}</TableCell>
      <TableCell>
        {value.dateManufacture && DateFns.formatDate(value.dateManufacture)}
      </TableCell>
      <TableCell>
        {value.expiryDate && DateFns.formatDate(value.expiryDate)}
      </TableCell>
    </TableRow>
  );
};

export default ReceiptEntity;
