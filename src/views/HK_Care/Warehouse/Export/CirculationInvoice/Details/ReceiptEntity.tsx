import { TableCell, TableRow } from '@mui/material';
import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import { defaultFilters } from 'constants/defaultFilters';
import { useWatch } from 'react-hook-form';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  item: any;
  index: number;
  setValue: any;
  getValues: any;
  arrayName: string;
  control: any;
}

const ReceiptEntity = ({
  item,
  index,
  setValue,
  getValues,
  arrayName,
  control,
}: IProps) => {
  const { productId } = item;
  const object = `${arrayName}.${index}`;

  const amount = useWatch({
    control,
    name: `${object}.amount`,
  });

  return (
    <TableRow hover tabIndex={-1} key={productId}>
      <TableCell>
        {(defaultFilters.pageIndex - 1) * defaultFilters.pageSize + index + 1}
      </TableCell>
      <TableCell>{getValues(`${object}.productName`)}</TableCell>
      <TableCell>{getValues(`${object}.measureName`)}</TableCell>
      <TableCell>{numberFormat(getValues(`${object}.amount`))}</TableCell>
      <TableCell>{numberFormat(getValues(`${object}.importPrice`))}</TableCell>
      <TableCell>
        {numberFormat(getValues(`${object}.importPrice`) * amount)}
      </TableCell>
    </TableRow>
  );
};

export default ReceiptEntity;
