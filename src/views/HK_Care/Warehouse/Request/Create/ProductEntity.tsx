import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, TableCell, TableRow } from '@mui/material';
import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import { useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';

interface IProps {
  index: number;
  remove: any;
  setValue: any;
  getValues: any;
  arrayName?: string;
  control: any;
  item: any;
}

const ProductEntity = ({
  index,
  remove,
  setValue,
  getValues,
  arrayName,
  control,
  item,
}: IProps) => {
  const { id } = useParams();
  const object = `${arrayName}.${index}`;

  const expectedMore =
    useWatch({ control, name: `${object}.expectedMore` }) || 0;

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
          {item.productName}
        </Box>
      </TableCell>
      <TableCell>
        <Box
          sx={{ height: '40px', verticalAlign: 'middle', display: 'inherit' }}
        >
          {item.measureName}
        </Box>
      </TableCell>
      <TableCell>
        <Box
          sx={{ height: '40px', verticalAlign: 'middle', display: 'inherit' }}
        >
          {item.expectedAuto}
        </Box>
      </TableCell>
      <TableCell sx={{ width: '140px !important' }}>
        {id ? (
          item.expectedMore
        ) : (
          <ControllerNumberInput
            name={`${object}.expectedMore`}
            setValue={setValue}
            control={control}
            defaultValue={item.expectedMore}
          />
        )}
      </TableCell>
      <TableCell>
        <Box
          sx={{ height: '40px', verticalAlign: 'middle', display: 'inherit' }}
        >
          {item.expectedAuto + expectedMore}
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
