import TimePicker from '@mui/lab/TimePicker';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import type {
  Control,
  FieldErrors,
  FieldPath,
  FieldValues
} from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface Props<T> extends Omit<TextFieldProps, 'name'> {
  errors: FieldErrors<T>;
  control: Control<T>;
  name: FieldPath<T>;
  mask?: string;
  onChangeSelect?: (date: Date | null) => void;
}

const ControllerTimePicker = <T extends FieldValues>(props: Props<T>) => {
  const { errors, control, name, mask, disabled, onChangeSelect, ...rest } =
    props;

  return (
    <Controller
      render={({ field: { ref, ...others } }) => (
        <TimePicker
          renderInput={(props) => (
            <TextField
              {...props}
              {...rest}
              fullWidth
              error={Boolean(errors[name])}
              helperText={errors[name]?.message}
              id={name}
            />
          )}
          mask={mask}
          InputAdornmentProps={{
            position: 'start',
          }}
          {...others}
          disabled={disabled}
          onChange={(value: Date | null) => {
            others.onChange(value);
            if (onChangeSelect) {
              onChangeSelect(value);
            }
          }}
        />
      )}
      name={name}
      control={control}
    />
  );
};

export default ControllerTimePicker;
