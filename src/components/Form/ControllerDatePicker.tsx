import { DatePicker } from '@mui/x-date-pickers';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import type {
  Control,
  FieldErrors,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface Props<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  errors: FieldErrors<T>;
  control: Control<T>;
  name: FieldPath<T>;
  mask?: string;
  onChangeSelect?: (date: Date | null) => void;
  minDate?: Date;
  placeholder?: string;
}

const ControllerDatePicker = <T extends FieldValues>(props: Props<T>) => {
  const {
    errors,
    control,
    name,
    disabled,
    mask,
    onChangeSelect,
    minDate,
    placeholder,
    ...rest
  } = props;

  return (
    <Controller
      render={({ field: { ref, ...others }, fieldState: { error } }) => (
        <DatePicker
          renderInput={(props: TextFieldProps) => {
            const inputProps = {
              ...props.inputProps,
              placeholder: placeholder || props?.inputProps?.placeholder || '',
            };
            const newProps = { ...props, inputProps };
            return (
              <TextField
                {...newProps}
                {...rest}
                fullWidth
                error={Boolean(error)}
                helperText={error?.message}
                placeholder="hehee"
                id={name}
              />
            );
          }}
          mask={mask}
          InputAdornmentProps={{
            position: 'end',
          }}
          {...others}
          disabled={disabled}
          inputFormat="dd/MM/yyyy"
          minDate={minDate}
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

export default ControllerDatePicker;
