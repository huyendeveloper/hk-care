import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, IconButton, TableCell, TableRow } from '@mui/material';
import { LinkIconButton } from 'components/common';
import { IProductExportCancel } from 'interface';
import { useState } from 'react';
import { FilterParams } from 'types';
import formatDateTime from 'utils/dateTimeFormat';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  groupName: string;
  list: any[];
  filters: FilterParams;
}

const renderAction = (row: IProductExportCancel) => {
  return (
    <>
      <LinkIconButton to={`${row.id}/${row.exportWHId}`}>
        <IconButton>
          <VisibilityIcon />
        </IconButton>
      </LinkIconButton>
      <LinkIconButton to={`${row.id}/${row.exportWHId}/update`}>
        <IconButton>
          <EditIcon />
        </IconButton>
      </LinkIconButton>
    </>
  );
};

const ExpandRow = ({ groupName, list, filters }: IProps) => {
  const [expand, setExpand] = useState<boolean>(true);

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        key={groupName}
        onClick={() => setExpand(!expand)}
      >
        <TableCell colSpan={4} sx={{ padding: '16px' }}>
          {groupName}
        </TableCell>
        <TableCell
          colSpan={1}
          sx={{
            padding: '17px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              transform: expand ? 'rotate(0)' : 'rotate(180deg)',
              display: 'flex',
            }}
          >
            <KeyboardArrowDownIcon />
          </Box>
        </TableCell>
      </TableRow>
      {/* @ts-ignore */}
      {expand &&
        list.map((item: IProductExportCancel, index) => {
          const { id, code, creationTime, cancellationPrice, rowId } = item;
          return (
            <TableRow hover tabIndex={-1} key={id}>
              <TableCell>
                {/* {(filters.pageIndex - 1) * filters.pageSize + index + 1 } */}
                {rowId}
              </TableCell>
              <TableCell>{code}</TableCell>
              <TableCell>{formatDateTime(creationTime)}</TableCell>
              <TableCell>{numberFormat(cancellationPrice)}</TableCell>
              <TableCell>{renderAction(item)}</TableCell>
            </TableRow>
          );
        })}
    </>
  );
};

export default ExpandRow;
