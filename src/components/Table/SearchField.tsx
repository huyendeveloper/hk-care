import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { memo, useState } from 'react';
import { useDebounce } from 'react-use';
import type { ChangeEvent, KeyDownEvent } from 'types';

interface Props {
  title?: string;
  placeHolder: string;
  onSearch: (searchTerm: string) => void;
  searchText: string;
}

const SearchField = (props: Props) => {
  const { title, searchText, placeHolder, onSearch } = props;
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
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {title ? (
        <FormLabel htmlFor="search">
          <Typography variant="body2" gutterBottom sx={{ ml: 0.5 }}>
            {title}
          </Typography>
        </FormLabel>
      ) : null}
      <TextField
        id="search"
        fullWidth
        placeholder={placeHolder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        sx={{ mr: 1, flexGrow: 1 }}
      />
    </Box>
  );
};

export default memo(SearchField);
