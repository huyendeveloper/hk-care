import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, TableCell, TableRow } from '@mui/material';
import { ControllerDatePicker, ControllerTextField } from 'components/Form';
import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import { defaultFilters } from 'constants/defaultFilters';
import { useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';

interface IProps {
  item: any;
  index: number;
  remove: any;
  errors?: any;
  register?: any;
  setValue: any;
  getValues: any;
  arrayName?: string;
  control: any;
}

const ProductEntity = ({
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
  const object = `${arrayName}.${index}`;
  const { id } = useParams();

  const addBudget = useWatch({ control, name: `${object}.addBudget` }) || 0;

  return (
    <TableRow hover tabIndex={-1} key={index}>
      <TableCell>
        <Box
          sx={{ height: '40px', verticalAlign: 'middle', display: 'inherit' }}
        >
          {index + 1}
        </Box>
      </TableCell>
      <TableCell>
        <Box
          sx={{ height: '40px', verticalAlign: 'middle', display: 'inherit' }}
        >
          {getValues(`${object}.name`)}
        </Box>
      </TableCell>
      <TableCell>
        <Box
          sx={{ height: '40px', verticalAlign: 'middle', display: 'inherit' }}
        >
          {getValues(`${object}.measureName`)}
        </Box>
      </TableCell>
      <TableCell>
        <Box
          sx={{ height: '40px', verticalAlign: 'middle', display: 'inherit' }}
        >
          {getValues(`${object}.budget`)}
        </Box>
      </TableCell>
      <TableCell sx={{ width: '140px' }}>
        {id ? (
          getValues(`${object}.addBudget`)
        ) : (
          <ControllerNumberInput
            name={`${object}.amount`}
            setValue={setValue}
            control={control}
            defaultValue={getValues(`${object}.addBudget`)}
          />
        )}
      </TableCell>
      <TableCell>
        <Box
          sx={{ height: '40px', verticalAlign: 'middle', display: 'inherit' }}
        >
          {getValues(`${object}.budget`) + addBudget}
        </Box>
      </TableCell>
      {!id && (
        <TableCell align="left">
          <IconButton
            onClick={() => {
              remove(index);
            }}
          >
            <CloseIcon />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );
};

export default ProductEntity;
