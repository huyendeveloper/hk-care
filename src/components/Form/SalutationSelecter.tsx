import Autocomplete from '@mui/material/Autocomplete';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface Props<T> extends Omit<TextFieldProps, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
  options: string[];
  placeholder: string;
  forcePopupIcon?: boolean;
}

const SalutationSelecter = <T extends FieldValues>(props: Props<T>) => {
  const {
    control,
    name,
    options,
    placeholder,
    disabled,
    forcePopupIcon,
    ...rest
  } = props;

  return (
    <Controller
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          id={name}
          options={options}
          disabled={disabled}
          forcePopupIcon={forcePopupIcon}
          getOptionLabel={(option) => option || 'Not available'}
          // noOptionsText={t('languageFirst')}
          renderInput={(params) => (
            <TextField
              error={Boolean(error)}
              helperText={error?.message && error?.message}
              placeholder={placeholder}
              {...params}
              {...rest}
            />
          )}
          {...field}
          onChange={(_event, value) => {
            field.onChange(value);
          }}
        />
      )}
      name={name}
      control={control}
    />
  );
};

export default SalutationSelecter;
