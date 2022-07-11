import { TableCell, TableRow } from '@mui/material';
import { defaultFilters } from 'constants/defaultFilters';
import { IProductExportCancel } from 'interface';
import DateFns from 'utils/DateFns';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  item: any;
  index: number;
  value: IProductExportCancel;
}

const ReceiptEntity = ({ item, index, value }: IProps) => {
  const { productId } = item;

  return (
    <TableRow hover tabIndex={-1} key={productId}>
      <TableCell>
        {(defaultFilters.pageIndex - 1) * defaultFilters.pageSize + index + 1}
      </TableCell>
      <TableCell>{value.productName}</TableCell>
      <TableCell>{value.measureName}</TableCell>
      <TableCell>{value.amount}</TableCell>
      <TableCell>{numberFormat(value.importPrice)}</TableCell>
      <TableCell>{numberFormat(value.importPrice)}</TableCell>
      <TableCell>{value.lotNumber}</TableCell>

      <TableCell>{DateFns.formatDate(value.creationTime)}</TableCell>
      <TableCell>{DateFns.formatDate(value.expiryDate)}</TableCell>
    </TableRow>
  );
};

export default ReceiptEntity;
