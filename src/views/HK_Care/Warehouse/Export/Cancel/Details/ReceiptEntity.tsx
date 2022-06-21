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
      <TableCell sx={{ width: '130px' }}>{value.measureName}</TableCell>
      <TableCell sx={{ width: '130px' }}>{value.amount}</TableCell>
      <TableCell sx={{ width: '130px' }}>
        {numberFormat(value.importPrice)}
      </TableCell>
      <TableCell sx={{ width: '130px' }}>{numberFormat(value.importPrice)}</TableCell>
      <TableCell sx={{ width: '130px' }}>{value.lotNumber}</TableCell>

      <TableCell sx={{ width: '185px' }}>
        {DateFns.formatDate(value.creationTime)}
      </TableCell>
      <TableCell sx={{ width: '185px' }}>
        {DateFns.formatDate(value.expiryDate)}
      </TableCell>
    </TableRow>
  );
};

export default ReceiptEntity;
