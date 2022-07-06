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
      <TableCell sx={{ width: '130px' }}>{item.measureName}</TableCell>
      <TableCell sx={{ width: '130px' }}>{numberFormat(item.amount)}</TableCell>
      <TableCell sx={{ width: '130px' }}>
        {numberFormat(item.importPrice)}
      </TableCell>
      <TableCell sx={{ width: '130px' }}>
        {numberFormat(item.amount * item.importPrice)}
      </TableCell>
      <TableCell sx={{ width: '130px' }}>{item.lotNumber}</TableCell>

      <TableCell sx={{ width: '185px' }}>
        {DateFns.formatDate(item.creationTime)}
      </TableCell>
      <TableCell sx={{ width: '185px' }}>
        {DateFns.formatDate(item.expiryDate)}
      </TableCell>

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
