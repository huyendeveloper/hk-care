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
import { TableHeader } from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { numberFormat } from 'utils/numberFormat';
import CloseIcon from '@mui/icons-material/Close';

interface IProps {
  index: number;
  control: any;
  setValue: any;
  getValues: any;
  handleRemove: () => void;
}

interface Data {
  mor: string;
  noon: string;
  night: string;
  description: string;
}

const getCells = (): Cells<Data> => [
  {
    id: 'mor',
    label: 'Sáng',
  },
  {
    id: 'noon',
    label: 'Trưa',
  },
  {
    id: 'night',
    label: 'Tối',
  },
  {
    id: 'description',
    label: 'Ghi chú',
  },
];

const OrderProduct = ({
  index,
  control,
  setValue,
  getValues,
  handleRemove,
}: IProps) => {
  const product = useWatch({
    control,
    name: `createOrderDetailDtos[${index}]`,
  });

  const cells = useMemo(() => getCells(), []);

  // @ts-ignore
  const measures = [];

  if (product.priceLevelThird) {
    measures.push({
      id: product.mesureNameLevelThird,
      price: product.priceLevelThird,
    });
  }

  if (product.priceLevelSecond) {
    measures.push({
      id: product.mesureNameLevelSecond,
      price: product.priceLevelSecond,
    });
  }

  if (product.priceLevelFirst) {
    measures.push({
      id: product.mesureNameLevelFirst,
      price: product.priceLevelFirst,
    });
  }

  useEffect(() => {
    const price = product.measure
      ? // @ts-ignore
        measures.find((x) => x.id === product.measure)?.price ||
        // @ts-ignore
        measures[0]?.price ||
        0
      : measures.length > 0
      ? // @ts-ignore
        measures[0]?.price
      : 0;

    setValue(
      `createOrderDetailDtos[${index}].billPerProduct`,
      (product.quantity || 0) * price - (product.discount || 0)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.quantity, product.measure, product.discount]);

  const handleOnSort = (field: string) => {};

  return (
    <TableRow hover tabIndex={-1} key={product.productId}>
      <TableCell sx={{ width: '50px !important' }}>
        {(defaultFilters.pageIndex - 1) * defaultFilters.pageSize + index + 1}
      </TableCell>
      <TableCell>
        <IconButton onClick={handleRemove}>
          <CloseIcon />
        </IconButton>
        {product.productName}
      </TableCell>
      <TableCell sx={{ width: '130px !important' }}>
        <EntitySelecter
          name={`createOrderDetailDtos[${index}].measure`}
          control={control}
          options={measures}
          renderLabel={(field) => field.id}
          placeholder=""
          noOptionsText="Không có đơn vị nào có thể chọn"
          defaultValue={measures.length > 0 ? measures[0].id : null}
        />
      </TableCell>
      <TableCell sx={{ width: '130px !important' }}>
        <ControllerNumberInput
          name={`createOrderDetailDtos[${index}].quantity`}
          setValue={setValue}
          value={getValues(`createOrderDetailDtos[${index}].quantity`)}
          control={control}
        />
      </TableCell>
      <TableCell sx={{ width: '130px !important' }}>
        {numberFormat(
          measures.find((x) => x.id === product.measure)?.price ||
            measures[0]?.price ||
            0
        )}
      </TableCell>
      <TableCell sx={{ width: '130px !important' }}>
        <ControllerNumberInput
          name={`createOrderDetailDtos[${index}].discount`}
          setValue={setValue}
          value={getValues(`createOrderDetailDtos[${index}].discount`)}
          control={control}
        />
      </TableCell>
      <TableCell sx={{ width: '130px !important' }}>
        {numberFormat(product.billPerProduct)}
      </TableCell>

      <TableCell>
        <TableContainer>
          <Table>
            <TableHeader
              cells={cells}
              onSort={handleOnSort}
              sortDirection={''}
              sortBy={''}
            />
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: '100px !important' }}>
                  <ControllerTextField
                    name={`createOrderDetailDtos[${index}].mor`}
                    variant="standard"
                    control={control}
                    defaultValue={getValues(
                      `createOrderDetailDtos[${index}].mor`
                    )}
                  />
                </TableCell>
                <TableCell sx={{ width: '100px !important' }}>
                  <ControllerTextField
                    name={`createOrderDetailDtos[${index}].noon`}
                    variant="standard"
                    control={control}
                    defaultValue={getValues(
                      `createOrderDetailDtos[${index}].noon`
                    )}
                  />
                </TableCell>
                <TableCell sx={{ width: '100px !important' }}>
                  <ControllerTextField
                    name={`createOrderDetailDtos[${index}].night`}
                    variant="standard"
                    control={control}
                    defaultValue={getValues(
                      `createOrderDetailDtos[${index}].night`
                    )}
                  />
                </TableCell>
                <TableCell sx={{ width: '200px !important' }}>
                  <ControllerTextField
                    name={`createOrderDetailDtos[${index}].description`}
                    variant="standard"
                    control={control}
                    defaultValue={getValues(
                      `createOrderDetailDtos[${index}].description`
                    )}
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
