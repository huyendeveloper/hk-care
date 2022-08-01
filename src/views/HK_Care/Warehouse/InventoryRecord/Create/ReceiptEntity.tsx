import CloseIcon from '@mui/icons-material/Close';
import { IconButton, TableCell, TableRow } from '@mui/material';
import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  product: any;
  index: number;
  remove: any;
  setValue: any;
  arrayName: string;
  control: any;
  show: boolean;
}

const ReceiptEntity = ({
  product,
  index,
  remove,
  setValue,
  arrayName,
  control,
  show,
}: IProps) => {
  const { id, v } = useParams();
  const object = `${arrayName}.${index}`;
  const { name, unit, amountOld, priceImport, priceExport } = product;

  const amountNew = useWatch({
    control,
    name: `${object}.amountNew`,
  });

  useEffect(() => {}, [amountNew]);

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>
        {index + 1}
        {v !== '0' && (
          <IconButton
            sx={{ mr: 0.5, p: 0 }}
            color="inherit"
            onClick={() => remove(index)}
            disabled={show}
          >
            <CloseIcon />
          </IconButton>
        )}
      </TableCell>

      <TableCell>{name}</TableCell>
      <TableCell>{unit}</TableCell>
      <TableCell>{numberFormat(amountOld)}</TableCell>
      <TableCell sx={{ width: '130px !important' }}>
        {v !== '0' ? (
          <ControllerNumberInput
            disabled={show}
            name={`${object}.amountNew`}
            setValue={setValue}
            control={control}
            defaultValue={amountNew || 0}
          />
        ) : (
          numberFormat(amountNew)
        )}
      </TableCell>
      <TableCell>{numberFormat(amountOld - amountNew)}</TableCell>
      <TableCell>{numberFormat(priceImport)} </TableCell>
      <TableCell>
        {numberFormat(priceImport * (amountOld - amountNew))}
      </TableCell>
      <TableCell>{numberFormat(priceExport)} </TableCell>
      <TableCell>
        {numberFormat(priceExport * (amountOld - amountNew))}
      </TableCell>
    </TableRow>
  );
};

export default ReceiptEntity;
