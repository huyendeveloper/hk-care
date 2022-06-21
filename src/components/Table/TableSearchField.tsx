import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import SearchField from './SearchField';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import { DatePicker } from '@mui/lab';
import DateFns from 'utils/DateFns';

interface Props extends BoxProps {
  placeHolder: string;
  onSearch: (searchTerm: string) => void;
  searchText: string;
  title?: string;
  headerTitle?: string;
  searchArea?: boolean;
  start?: Date | null;
  end?: Date | null;
  setStart?: (date: Date | null) => void;
  setEnd?: (date: Date | null) => void;
}

const TableSearchField = (props: Props) => {
  const {
    title,
    placeHolder,
    searchText,
    onSearch,
    children,
    headerTitle,
    searchArea,
    onDragStart,
    start,
    end,
    setStart,
    setEnd,
    ...rest
  } = props;

  return (
    <Wrapper {...rest}>
      {headerTitle && (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 1.5, fontWeight: 'regular' }}
        >
          {headerTitle}
        </Typography>
      )}

      <SearchField
        title={title}
        placeHolder={placeHolder}
        onSearch={onSearch}
        searchText={searchText}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Stack direction="row" spacing={1}>
            {children}
          </Stack>
        </Box>
      </SearchField>
      {searchArea && (
        <Stack
          flexDirection="row"
          gap={1}
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mt: 2 }}
        >
          <DatePicker
            // @ts-ignore
            value={start}
            onChange={(newValue) => {
              setStart && setStart(newValue || null);
            }}
            inputFormat="dd/MM/yyyy"
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  placeholder: 'Từ',
                }}
              />
            )}
          />
          <RemoveIcon />

          <DatePicker
            // @ts-ignore
            value={end}
            onChange={(newValue) => {
              setEnd && setEnd(newValue || null);
            }}
            inputFormat="dd/MM/yyyy"
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  placeholder: 'Đến',
                }}
              />
            )}
          />
        </Stack>
      )}
    </Wrapper>
  );
};

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
}));

export default TableSearchField;
