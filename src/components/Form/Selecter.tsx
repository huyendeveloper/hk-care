import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useDebounce } from 'react-use';

export interface Label extends FieldValues {
  name: string;
  caption: string | null;
}

interface Props<T, O extends FieldValues[]>
  extends Omit<TextFieldProps, 'name'> {
  options: O;
  renderLabel: (option: O[number]) => string;
  renderValue?: keyof O[number] & string;
  sublabel?: (option: O[number]) => string;
  onChangeSelect?: (id: number | null) => Promise<void> | void;
  getOptionDisabled?: (option: number) => boolean;
  placeholder: string;
  forcePopupIcon?: boolean;
  noOptionsText?: string;
  handleChangeInput?: (value: string) => void;
  defaultValue?: string;
  loading?: boolean;
}

const Selecter = <T extends FieldValues, O extends FieldValues[]>(
  props: Props<T, O>
) => {
  const {
    options,
    renderLabel,
    renderValue,
    sublabel,
    onChangeSelect,
    placeholder,
    disabled,
    forcePopupIcon,
    noOptionsText,
    getOptionDisabled,
    handleChangeInput,
    defaultValue,
    loading = false,
    ...rest
  } = props;

  const [valueInput, setValueInput] = useState<string>('');

  const labels = options.reduce((acc: Record<number, Label>, option) => {
    const id = renderValue ? option[renderValue] : option.productId;
    const caption = sublabel ? sublabel(option) : null;
    acc[id] = { id, name: renderLabel(option), caption };
    return acc;
  }, {});

  useDebounce(
    () => {
      handleChangeInput && handleChangeInput(valueInput);
    },
    1500,
    [valueInput]
  );

  return (
    <Autocomplete
      disabled={disabled}
      forcePopupIcon={forcePopupIcon}
      options={options.map((option) => {
        return renderValue ? option[renderValue] : '';
      })}
      getOptionLabel={(option) => {
        return labels[option]?.name || defaultValue || '';
      }}
      loading={loading}
      noOptionsText={noOptionsText}
      getOptionDisabled={getOptionDisabled}
      style={{ flex: '1' }}
      multiple={false}
      renderInput={(params) => {
        // @ts-ignore
        params.inputProps.value = params.inputProps.value || defaultValue;

        return (
          <TextField
            placeholder={placeholder}
            value={valueInput}
            onChange={(e) => {
              setValueInput(e.target.value);
            }}
            {...params}
            {...rest}
          />
        );
      }}
      renderOption={(props, option: number) => {
        const { name, caption } = labels[option];
        return (
          <Box component="li" {...props} key={option}>
            <Box>
              {name || defaultValue}
              {caption && (
                <Typography variant="caption" display="block">
                  {caption}
                </Typography>
              )}
            </Box>
          </Box>
        );
      }}
      onChange={(_event, value: number | null) => {
        if (onChangeSelect) {
          onChangeSelect(value);
        }
      }}
    />
  );
};

export default Selecter;
