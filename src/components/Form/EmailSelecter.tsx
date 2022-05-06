import Autocomplete from '@mui/material/Autocomplete';
import type { ChipProps } from '@mui/material/Chip';
import Chip from '@mui/material/Chip';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface Props<T> extends Omit<TextFieldProps, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
}

const EmailSelecter = <T extends FieldValues>(props: Props<T>) => {
  const { control, name, disabled, ...rest } = props;

  return (
    <Controller
      render={({ field, fieldState: { error: errors } }) => (
        <Autocomplete
          id={name}
          multiple
          freeSolo
          options={[]}
          disabled={disabled}
          renderTags={(values: any[], getTagProps) =>
            values.map((option: string, index: number) => {
              const color: ChipProps['color'] =
                Array.isArray(errors) && errors[index]?.message
                  ? 'error'
                  : 'default';
              return (
                <Chip
                  size="small"
                  variant="outlined"
                  label={option}
                  color={color}
                  {...getTagProps({ index })}
                />
              );
            })
          }
          renderInput={(params) => {
            const helperText: TextFieldProps['helperText'] = Array.isArray(
              errors
            )
              ? errors[errors.length - 1]?.message
              : errors?.message;
            return (
              <TextField
                error={Boolean(errors)}
                helperText={helperText}
                {...params}
                {...rest}
              />
            );
          }}
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

export default EmailSelecter;
