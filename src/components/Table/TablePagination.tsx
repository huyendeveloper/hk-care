import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select, { selectClasses } from '@mui/material/Select';
import Typography from '@mui/material/Typography';

interface Props {
  pageIndex: number;
  totalPages: number;
  onChangePage: (pageIndex: number) => void;
  onChangeRowsPerPage: (rowsPerPage: number) => void;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  isSmall?: boolean;
  totalItem?: number;
}

const TablePagination = (props: Props) => {
  const {
    pageIndex,
    totalPages,
    rowsPerPage,
    totalItem = 0,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
    isSmall = false,
  } = props;

  const handleChangePage = (_event: unknown, pageIndex: number) => {
    onChangePage(pageIndex);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
    onChangeRowsPerPage(Number(event.target.value));
  };

  return (
    <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-between' }}>
      <Box
        sx={{
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          mr: 3,
        }}
      >
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ whiteSpace: 'nowrap' }}
        >
          Số bản ghi trên trang
        </Typography>
        <FormControl sx={{ ml: 1, mr: 2 }}>
          <Select
            value={String(rowsPerPage)}
            onChange={handleChangeRowsPerPage}
            size="small"
            variant="standard"
            disableUnderline
            sx={{
              [`& .${selectClasses.select}`]: {
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                pb: 0,
              },
            }}
          >
            {rowsPerPageOptions.map((rowsPerPage) => (
              <MenuItem key={rowsPerPage} value={rowsPerPage}>
                {rowsPerPage}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Stack flexDirection="row" alignItems="center">
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ whiteSpace: 'nowrap' }}
        >
          {totalPages === 0 ? 0 : (pageIndex - 1) * rowsPerPage + 1}–
          {pageIndex * rowsPerPage > totalPages
            ? totalPages
            : pageIndex * rowsPerPage}{' '}
          trên tổng {totalPages}
        </Typography>
        <Pagination
          page={pageIndex}
          count={Math.ceil(totalPages / rowsPerPage)}
          shape="rounded"
          showFirstButton={!isSmall}
          showLastButton={!isSmall}
          onChange={handleChangePage}
          size={isSmall ? 'small' : 'medium'}
        />
      </Stack>
    </Box>
  );
};

export default TablePagination;
