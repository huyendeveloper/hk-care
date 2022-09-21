import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, TableCell, TableRow } from '@mui/material';
import { ControllerDatePicker, ControllerTextField } from 'components/Form';
import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import { defaultFilters } from 'constants/defaultFilters';
import moment from 'moment';
import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Bill from './Bill';

interface IProps {
  item: any;
  index: number;
  remove: any;
  errors: any;
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
  setValue,
  getValues,
  arrayName,
  control,
}: IProps) => {
  const { id } = useParams();
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

  const dateManufacture = useWatch({
    control,
    name: `${object}.dateManufacture`,
  });

  const expiryDate = useWatch({
    control,
    name: `${object}.expiryDate`,
  });

  useEffect(() => {
    if (importPrice > price) {
      setValue(`${object}.price`, importPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importPrice]);

  useEffect(() => {
    if (id) return;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(new Date().getDate() - 1);
    if (moment(dateManufacture).isAfter(moment(today))) {
      setValue(`${object}.dateManufacture`, yesterday);
    }
    if (moment(yesterday).isAfter(moment(expiryDate))) {
      setValue(`${object}.expiryDate`, today);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiryDate, dateManufacture]);

  return (
    <TableRow hover tabIndex={-1} key={productId}>
      <TableCell sx={{ paddingY: '20px' }}>
        <Box
          sx={{ height: '40px', verticalAlign: 'middle', display: 'inherit' }}
        >
          {(defaultFilters.pageIndex - 1) * defaultFilters.pageSize + index + 1}
        </Box>
      </TableCell>
      <TableCell sx={{ verticalAlign: 'top', paddingY: '20px' }}>
        <Box
          sx={{ height: '40px', verticalAlign: 'middle', display: 'inherit' }}
        >
          {getValues(`${object}.name`)}
        </Box>
      </TableCell>
      <TableCell sx={{ verticalAlign: 'top', paddingY: '20px' }}>
        <Box
          sx={{ height: '40px', verticalAlign: 'middle', display: 'inherit' }}
        >
          {getValues(`${object}.measure`)}
        </Box>
      </TableCell>
      <TableCell
        sx={{
          verticalAlign: 'top',
          paddingY: '20px',
          width: '80px !important',
        }}
      >
        <ControllerNumberInput
          name={`${object}.amount`}
          setValue={setValue}
          control={control}
          defaultValue={getValues(`${object}.amount`)}
          disabled={Boolean(id)}
        />
      </TableCell>
      <TableCell
        sx={{
          verticalAlign: 'top',
          paddingY: '20px',
          width: '130px !important',
        }}
      >
        <ControllerNumberInput
          name={`${object}.importPrice`}
          setValue={setValue}
          control={control}
          value={getValues(`${object}.importPrice`)}
          disabled={Boolean(id)}
        />
      </TableCell>
      <TableCell
        sx={{
          verticalAlign: 'top',
          paddingY: '20px',
          width: '130px !important',
        }}
      >
        <ControllerNumberInput
          name={`${object}.price`}
          value={getValues(`${object}.price`)}
          setValue={setValue}
          control={control}
          errors={importPrice > price ? 'Giá bán không hợp lệ!' : ''}
          disabled={Boolean(id)}
        />
      </TableCell>
      <TableCell
        sx={{
          verticalAlign: 'top',
          paddingY: '20px',
          width: '130px !important',
        }}
      >
        <ControllerNumberInput
          name={`${object}.discount`}
          defaultValue={getValues(`${object}.discount`)}
          setValue={setValue}
          control={control}
          disabled={Boolean(id)}
        />
      </TableCell>
      <TableCell sx={{ verticalAlign: 'top', paddingY: '20px' }}>
        <Bill control={control} index={index} />
      </TableCell>

      <TableCell
        sx={{
          verticalAlign: 'top',
          paddingY: '20px',
          width: '120px !important',
        }}
      >
        <ControllerTextField
          name={`${object}.lotNumber`}
          control={control}
          disabled={Boolean(id)}
        />
      </TableCell>
      <TableCell
        sx={{
          verticalAlign: 'top',
          paddingY: '20px',
          width: '120px !important',
        }}
      >
        <ControllerTextField
          name={`${object}.numberRegister`}
          control={control}
          disabled={Boolean(id)}
        />
      </TableCell>
      <TableCell
        sx={{
          verticalAlign: 'top',
          paddingY: '20px',
          width: '178px !important',
        }}
      >
        <ControllerDatePicker
          name={`${object}.dateManufacture`}
          control={control}
          errors={errors}
          disabled={Boolean(id)}
        />
      </TableCell>
      <TableCell
        sx={{
          verticalAlign: 'top',
          paddingY: '20px',
          width: '178px !important',
        }}
      >
        <ControllerDatePicker
          name={`${object}.expiryDate`}
          control={control}
          errors={errors}
          disabled={Boolean(id)}
        />
      </TableCell>

      <TableCell sx={{ verticalAlign: 'top', paddingY: '20px' }} align="left">
        {id ? (
          <></>
        ) : (
          <IconButton
            onClick={() => {
              remove(index);
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ReceiptEntity;
