import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { memo, useState } from 'react';
import { useDebounce } from 'react-use';
import type { ChangeEvent, KeyDownEvent } from 'types';
import type { BoxProps } from '@mui/material/Box';

interface Props extends BoxProps {
  title?: string;
  placeHolder: string;
  onSearch: (searchTerm: string) => void;
  searchText: string;
}

const SearchField = (props: Props) => {
  const { title, searchText, placeHolder, onSearch, children } = props;
  const [value, setValue] = useState<string>('');

  const handleChange: ChangeEvent = (event) => {
    setValue(event.target.value);
  };

  const handleKeyDown: KeyDownEvent = async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSearch(value);
    }
  };

  useDebounce(
    () => {
      if (searchText !== value) {
        onSearch(value);
      }
    },
    1500, //auto search each 1500 ms
    [value]
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          justifyContent: 'space-between',
        }}
      >
        {title ? (
          <FormLabel htmlFor="search">
            <Typography gutterBottom sx={{ mb: 0, fontSize: '1.74rem' }}>
              {title}
            </Typography>
          </FormLabel>
        ) : null}
        {children}
      </Box>
      <TextField
        id="search"
        fullWidth
        placeholder={placeHolder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        sx={{ mr: 1, flexGrow: 1 }}
      />
    </>
  );
};

export default memo(SearchField);
