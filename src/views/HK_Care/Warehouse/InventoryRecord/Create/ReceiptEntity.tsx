import CloseIcon from '@mui/icons-material/Close';
import { IconButton, TableCell, TableRow } from '@mui/material';
import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import { useWatch } from 'react-hook-form';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  product: any;
  index: number;
  remove: any;
  setValue: any;
  arrayName: string;
  control: any;
}

const ReceiptEntity = ({
  product,
  index,
  remove,
  setValue,
  arrayName,
  control,
}: IProps) => {
  const object = `${arrayName}.${index}`;
  const { name, unit, amountOld, priceImport, priceExport } = product;

  const amountNew = useWatch({
    control,
    name: `${object}.amountNew`,
  });

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>
        {index + 1}
        <IconButton
          sx={{ mr: 0.5, p: 0 }}
          color="inherit"
          onClick={() => remove(index)}
        >
          <CloseIcon />
        </IconButton>
      </TableCell>

      <TableCell>{name}</TableCell>
      <TableCell>{unit}</TableCell>
      <TableCell>{numberFormat(amountOld)}</TableCell>
      <TableCell sx={{ width: '130px !important' }}>
        <ControllerNumberInput
          name={`${object}.amountNew`}
          setValue={setValue}
          control={control}
          defaultValue={amountNew || 0}
        />
      </TableCell>
      <TableCell>{numberFormat(amountOld - amountNew)}</TableCell>
      <TableCell>{numberFormat(priceImport)}</TableCell>
      <TableCell>
        {numberFormat(priceImport * (amountOld - amountNew))}
      </TableCell>
      <TableCell>{numberFormat(priceExport)}</TableCell>
      <TableCell>
        {numberFormat(priceExport * (amountOld - amountNew))}
      </TableCell>
    </TableRow>
  );
};

export default ReceiptEntity;
