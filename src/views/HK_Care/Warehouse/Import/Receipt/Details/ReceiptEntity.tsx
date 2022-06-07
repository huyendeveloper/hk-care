import { TableCell, TableRow, TextField } from '@mui/material';
import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import { defaultFilters } from 'constants/defaultFilters';
import React from 'react';
import Bill from './Bill';

interface IProps {
  item: any;
  index: number; 
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
  errors,
  register,
  setValue,
  getValues,
  arrayName,
  control,
}: IProps) => {
  const { productId, productName, mesure } = item;
  const object = `${arrayName}.${index}`;

  return (
    <TableRow hover tabIndex={-1} key={productId}>
      <TableCell>
        {(defaultFilters.pageIndex - 1) * defaultFilters.pageSize + index + 1}
      </TableCell>
      <TableCell>{productName}</TableCell>
      <TableCell sx={{ width: '130px' }}>{mesure}</TableCell>
      <TableCell sx={{ width: '130px' }}>
        <ControllerNumberInput
          name={`${object}.amount`}
          defaultValue={getValues(`${object}.amount`)}
          setValue={setValue}
          inputRef={register(`${object}.amount`).ref}
        />
      </TableCell>
      <TableCell sx={{ width: '130px' }}>
        <ControllerNumberInput
          name={`${object}.importPrice`}
          defaultValue={getValues(`${object}.importPrice`)}
          setValue={setValue}
        />
      </TableCell>
      <TableCell sx={{ width: '130px' }}>
        <ControllerNumberInput
          name={`${object}.price`}
          defaultValue={getValues(`${object}.price`)}
          setValue={setValue}
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
        {/* {getValues(`${object}.amount`) * getValues(`${object}.importPrice`) -
          getValues(`${object}.discount`) || 0} */}
        <Bill control={control} index={index} />
      </TableCell>

      <TableCell sx={{ width: '130px' }}>
        <TextField
          fullWidth
          type="number"
          {...register(`${object}.lotNumber`)}
        />
      </TableCell>
      <TableCell sx={{ width: '130px' }}>
        <TextField
          fullWidth
          type="number"
          {...register(`${object}.numberRegister`)}
        />
      </TableCell>
      <TableCell sx={{ width: '185px' }}>
        <TextField
          type="date"
          variant="outlined"
          {...register(`${object}.dateManufacture`)}
        />
      </TableCell>
      <TableCell sx={{ width: '185px' }}>
        <TextField
          type="date"
          variant="outlined"
          {...register(`${object}.outOfDate`)}
        />
      </TableCell>

     
    </TableRow>
  );
};

export default ReceiptEntity;
