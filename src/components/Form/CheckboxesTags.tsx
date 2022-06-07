import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface IProps {
  listData: object[];
  handleChange: (e: React.SyntheticEvent<Element, Event>, val: any[]) => void;
  loading: boolean;
  value: any;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const CheckboxesTags = ({ listData, handleChange, loading, value }: IProps) => {
  return (
    <Autocomplete
      multiple
      options={listData}
      disableCloseOnSelect
      // @ts-ignore
      getOptionLabel={(option) => option.productName}
      noOptionsText="Không tìm thấy dữ liệu"
      loading={loading}
      value={value}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {/* @ts-ignore */}
          {option.productName}
        </li>
      )}
      onChange={handleChange}
      style={{ flex: '1' }}
      renderInput={(params) => (
        <TextField {...params} label="" placeholder="" />
      )}
    />
  );
};

export default CheckboxesTags;
