import CloseIcon from '@mui/icons-material/Close';
import { IconButton, TableCell, TableRow } from '@mui/material';
import { defaultFilters } from 'constants/defaultFilters';
import DateFns from 'utils/DateFns';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  item: any;
  index: number;
  remove: any;
  errors: any;
  register: any;
  setValue: any;
  getValues: any;
  arrayName: string;
  control: any;
}

const ReceiptEntity = ({
  item,
  index,
  remove,
  errors,
  register,
  setValue,
  getValues,
  arrayName,
  control,
}: IProps) => {
  const { productId } = item;
  const object = `${arrayName}.${index}`;

  return (
    <TableRow hover tabIndex={-1} key={productId}>
      <TableCell>
        {(defaultFilters.pageIndex - 1) * defaultFilters.pageSize + index + 1}
      </TableCell>
      <TableCell>{getValues(`${object}.productName`)}</TableCell>
      <TableCell sx={{ width: '130px' }}>
        {getValues(`${object}.measureName`)}
      </TableCell>
      <TableCell sx={{ width: '130px' }}>
        {numberFormat(getValues(`${object}.amount`))}
      </TableCell>
      <TableCell sx={{ width: '130px' }}>
        {numberFormat(getValues(`${object}.importPrice`))}
      </TableCell>
      <TableCell sx={{ width: '130px' }}>
        {numberFormat(
          getValues(`${object}.amount`) * getValues(`${object}.importPrice`)
        )}
      </TableCell>
      <TableCell sx={{ width: '130px' }}>
        {getValues(`${object}.lotNumber`)}
      </TableCell>

      <TableCell sx={{ width: '185px' }}>
        {DateFns.formatDate(getValues(`${object}.creationTime`))}
      </TableCell>
      <TableCell sx={{ width: '185px' }}>
        {DateFns.formatDate(getValues(`${object}.expiryDate`))}
      </TableCell>

      <TableCell align="left">
        <IconButton
          onClick={() => {
            remove(index);
          }}
        >
          <CloseIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default ReceiptEntity;
