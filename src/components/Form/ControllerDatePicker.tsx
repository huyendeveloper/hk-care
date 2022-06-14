import DatePicker from '@mui/lab/DatePicker';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import type {
  Control,
  FieldErrors,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface Props<T> extends Omit<TextFieldProps, 'name'> {
  errors: FieldErrors<T>;
  control: Control<T>;
  name: FieldPath<T>;
  mask?: string;
  onChangeSelect?: (date: Date | null) => void;
  minDate?: Date;
  error?: boolean;
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
    error = false,
    ...rest
  } = props;

  if (control) {
    return (
      <Controller
        render={({ field: { ref, ...others } }) => {
          return (
            <DatePicker
              renderInput={(props) => {
                const newProps = others.value
                  ? props
                  : {
                      ...props,
                      inputProps: { ...props.inputProps, value: '' },
                    };
                return (
                  <TextField
                    {...newProps}
                    {...rest}
                    fullWidth
                    error={Boolean(errors[name]) || error}
                    helperText={errors[name]?.message}
                    id={name}
                  />
                );
              }}
              mask={mask}
              {...others}
              inputFormat="dd/MM/yyyy"
              disabled={disabled}
              minDate={minDate}
              onChange={(value: Date | null) => {
                others.onChange(value);
                if (onChangeSelect) {
                  onChangeSelect(value);
                }
              }}
            />
          );
        }}
        name={name}
        control={control}
      />
    );
  }

  return <TextField type="date" variant="outlined" {...props} />;
};

export default ControllerDatePicker;
