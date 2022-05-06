import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface Props<T> extends Omit<TextFieldProps, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
}

const ControllerTextField = <T extends FieldValues>(props: Props<T>) => {
  const { control, name, ...rest } = props;

  return (
    <Controller
      render={({ field, fieldState: { error } }) => (
        <TextField
          id={name}
          fullWidth
          error={Boolean(error)}
          helperText={error?.message && error.message}
          {...field}
          {...rest}
        />
      )}
      name={name}
      control={control}
    />
  );
};

export default ControllerTextField;
