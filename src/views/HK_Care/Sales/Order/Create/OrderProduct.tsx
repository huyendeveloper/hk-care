import CloseIcon from '@mui/icons-material/Close';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { ControllerTextField, EntitySelecter } from 'components/Form';
import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import { defaultFilters } from 'constants/defaultFilters';
import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  index: number;
  control: any;
  setValue: any;
  getValues: any;
  handleRemove: () => void;
}

const OrderProduct = ({
  index,
  control,
  setValue,
  getValues,
  handleRemove,
}: IProps) => {
  const { id } = useParams();
  const object = `orderDetailDtos.${index}`;
  const product = useWatch({
    control,
    name: `${object}`,
  });

  const measures = useWatch({
    control,
    name: `${object}.measureListDtos`,
  });

  const measureId = useWatch({
    control,
    name: `${object}.measureId`,
  });

  const price = useWatch({
    control,
    name: `${object}.price`,
  });

  useEffect(() => {
    const price = measureId
      ? // @ts-ignore
        measures.find((x) => x.id === measureId)?.price ||
        // @ts-ignore
        measures[0]?.price ||
        0
      : measures.length > 0
      ? // @ts-ignore
        measures[0]?.price
      : 0;

    setValue(`${object}.price`, price);

    setValue(
      `${object}.billPerProduct`,
      (product.quantity || 0) * price - (product.discount || 0)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.quantity, measureId, product.discount]);

  return (
    <TableRow hover tabIndex={-1} key={product.productId}>
      <TableCell>
        {(defaultFilters.pageIndex - 1) * defaultFilters.pageSize + index + 1}{' '}
        {!id && (
          <IconButton onClick={handleRemove} sx={{ p: 0 }}>
            <CloseIcon />
          </IconButton>
        )}
      </TableCell>
      <TableCell>{product.productName}</TableCell>
      <TableCell sx={{ width: '120px !important' }}>
        <EntitySelecter
          name={`${object}.measureId`}
          control={control}
          options={measures}
          renderLabel={(field) => field.name}
          placeholder=""
          disableClearable
          noOptionsText="Không có đơn vị nào có thể chọn"
          disabled={Boolean(id)}
        />
      </TableCell>
      <TableCell sx={{ width: '90px !important' }}>
        <ControllerNumberInput
          name={`${object}.quantity`}
          setValue={setValue}
          value={getValues(`${object}.quantity`)}
          control={control}
          disabled={Boolean(id)}
        />
      </TableCell>
      <TableCell>{numberFormat(price)}</TableCell>
      <TableCell sx={{ width: '120px !important' }}>
        <ControllerNumberInput
          name={`${object}.discount`}
          setValue={setValue}
          value={getValues(`${object}.discount`)}
          control={control}
          disabled={Boolean(id)}
        />
      </TableCell>
      <TableCell>{numberFormat(product.billPerProduct)}</TableCell>

      <TableCell>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ padding: '5px 8px', fontWeight: 'bold' }}>
                  Sáng
                </TableCell>
                <TableCell sx={{ padding: '5px 8px', fontWeight: 'bold' }}>
                  Trưa
                </TableCell>
                <TableCell sx={{ padding: '5px 8px', fontWeight: 'bold' }}>
                  Tối
                </TableCell>
                <TableCell sx={{ padding: '5px 8px', fontWeight: 'bold' }}>
                  Ghi chú
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    borderBottom: 'none',
                    width: '70px !important',
                    padding: '0 8px',
                  }}
                >
                  <ControllerTextField
                    name={`${object}.mor`}
                    variant="standard"
                    control={control}
                    defaultValue={getValues(`${object}.mor`)}
                    disabled={Boolean(id)}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: 'none',
                    width: '70px !important',
                    padding: '0 8px',
                  }}
                >
                  <ControllerTextField
                    name={`${object}.noon`}
                    variant="standard"
                    control={control}
                    defaultValue={getValues(`${object}.noon`)}
                    disabled={Boolean(id)}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: 'none',
                    width: '70px !important',
                    padding: '0 8px',
                  }}
                >
                  <ControllerTextField
                    name={`${object}.night`}
                    variant="standard"
                    control={control}
                    defaultValue={getValues(`${object}.night`)}
                    disabled={Boolean(id)}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: 'none',
                    width: '200px !important',
                    padding: '0 8px',
                  }}
                >
                  <ControllerTextField
                    name={`${object}.description`}
                    variant="standard"
                    control={control}
                    defaultValue={getValues(`${object}.description`)}
                    disabled={Boolean(id)}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TableCell>
    </TableRow>
  );
};

export default OrderProduct;
