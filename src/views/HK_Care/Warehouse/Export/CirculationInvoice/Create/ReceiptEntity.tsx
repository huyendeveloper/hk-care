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
      <TableCell>
        {(defaultFilters.pageIndex - 1) * defaultFilters.pageSize + index + 1}
      </TableCell>
      <TableCell>{getValues(`${object}.name`)}</TableCell>
      <TableCell sx={{ width: '130px' }}>
        {getValues(`${object}.measure`)}
      </TableCell>
      <TableCell sx={{ width: '130px' }}>{0}</TableCell>
      <TableCell sx={{ width: '130px' }}>{0}</TableCell>
      <TableCell sx={{ width: '130px' }}>{0}</TableCell>
      <TableCell sx={{ width: '130px' }}>{'HK343'}</TableCell>

      <TableCell sx={{ width: '185px' }}>{'12/12/2022'}</TableCell>

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
