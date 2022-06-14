import CloseIcon from '@mui/icons-material/Close';
import { IconButton, TableCell, TableRow, TextField } from '@mui/material';
import { ControllerDatePicker } from 'components/Form';
import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import { defaultFilters } from 'constants/defaultFilters';
import moment from 'moment';
import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import Bill from './Bill';

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

  const importPrice = useWatch({
    control,
    name: `${object}.importPrice`,
  });

  const price = useWatch({
    control,
    name: `${object}.price`,
  });
  const lotNumber = useWatch({
    control,
    name: `${object}.lotNumber`,
  });
  const numberRegister = useWatch({
    control,
    name: `${object}.numberRegister`,
  });

  const dateManufacture = useWatch({
    control,
    name: `${object}.dateManufacture`,
  });
  const outOfDate = useWatch({
    control,
    name: `${object}.outOfDate`,
  });

  useEffect(() => {
    if (importPrice > price) {
      setValue(`${object}.price`, importPrice);
    }
  }, [importPrice]);

  useEffect(() => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(new Date().getDate() - 1);
    if (moment(dateManufacture).isAfter(moment(yesterday))) {
      setValue(`${object}.dateManufacture`, yesterday);
    }
    if (moment(yesterday).isAfter(moment(outOfDate))) {
      setValue(`${object}.outOfDate`, today);
    }
  }, [outOfDate, dateManufacture]);

  return (
    <TableRow hover tabIndex={-1} key={productId}>
      <TableCell>
        {(defaultFilters.pageIndex - 1) * defaultFilters.pageSize + index + 1}
      </TableCell>
      <TableCell>{getValues(`${object}.name`)}</TableCell>
      <TableCell sx={{ width: '130px' }}>
        {getValues(`${object}.measure`)}
      </TableCell>
      <TableCell sx={{ width: '130px' }}>
        <ControllerNumberInput
          name={`${object}.amount`}
          defaultValue={getValues(`${object}.amount`)}
          setValue={setValue}
        />
      </TableCell>
      <TableCell sx={{ width: '130px' }}>
        <ControllerNumberInput
          name={`${object}.importPrice`}
          setValue={setValue}
          defaultValue={getValues(`${object}.importPrice`)}
        />
      </TableCell>
      <TableCell sx={{ width: '130px' }}>
        <ControllerNumberInput
          name={`${object}.price`}
          defaultValue={getValues(`${object}.price`)}
          setValue={setValue}
          error={importPrice > price}
        />
      </TableCell>
      <TableCell sx={{ width: '130px' }}>
        <ControllerNumberInput
          name={`${object}.discount`}
          defaultValue={getValues(`${object}.discount`)}
          setValue={setValue}
        />
      </TableCell>
      <TableCell>
        <Bill control={control} index={index} />
      </TableCell>

      <TableCell sx={{ width: '130px' }}>
        <TextField
          fullWidth
          type="number"
          required
          {...register(`${object}.lotNumber`)}
          error={!lotNumber}
        />
      </TableCell>
      <TableCell sx={{ width: '130px' }}>
        <TextField
          fullWidth
          type="number"
          required
          {...register(`${object}.numberRegister`)}
          error={!numberRegister}
        />
      </TableCell>
      <TableCell sx={{ width: '185px' }}>
        <ControllerDatePicker
          required
          name={`${object}.dateManufacture`}
          control={control}
          errors={errors}
          error={
            !dateManufacture ||
            dateManufacture === '' ||
            !moment(dateManufacture, 'dd/MM/yyyy', true).isValid()
          }
        />
      </TableCell>
      <TableCell sx={{ width: '185px' }}>
        <ControllerDatePicker
          required
          name={`${object}.outOfDate`}
          control={control}
          errors={errors}
          error={
            !outOfDate ||
            outOfDate === '' ||
            !moment(outOfDate, 'dd/MM/yyyy', true).isValid() ||
            moment(outOfDate).isBefore(moment(dateManufacture))
          }
        />
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
