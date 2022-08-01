import CloseIcon from '@mui/icons-material/Close';
import { IconButton, TableCell, TableRow } from '@mui/material';
import DateFns from 'utils/DateFns';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  item: any;
  index: number;
  remove: any;
}

const ReceiptEntity = ({ item, index, remove }: IProps) => {
  const { productId } = item;

  return (
    <TableRow hover tabIndex={-1} key={productId}>
      <TableCell>{index}</TableCell>
      <TableCell>{item.productName}</TableCell>
      <TableCell>{item.measureName}</TableCell>
      <TableCell>{numberFormat(item.amount)}</TableCell>
      <TableCell>{numberFormat(item.importPrice)}</TableCell>
      <TableCell>{numberFormat(item.amount * item.importPrice)}</TableCell>
      <TableCell>{item.lotNumber}</TableCell>

      <TableCell>{DateFns.formatDate(item.creationTime)}</TableCell>
      <TableCell>{DateFns.formatDate(item.expiryDate)}</TableCell>

      <TableCell align="left">
        <IconButton
          onClick={() => {
            remove(index - 1);
          }}
        >
          <CloseIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default ReceiptEntity;
