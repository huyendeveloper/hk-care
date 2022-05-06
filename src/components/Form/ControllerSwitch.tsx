import FormControl from '@mui/material/FormControl';
import type { FormControlLabelProps } from '@mui/material/FormControlLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface Props<T> extends Omit<FormControlLabelProps, 'control'> {
  control: Control<T>;
  name: FieldPath<T>;
  onChangeSelect?: (value: boolean) => void;
}

const ControllerSwitch = <T extends FieldValues>(props: Props<T>) => {
  const { control, name, onChangeSelect, ...rest } = props;

  return (
    <Controller
      render={({ field, fieldState: { error } }) => (
        <FormControl error={Boolean(error)}>
          <FormControlLabel
            {...rest}
            {...field}
            onChange={(_event, value: boolean) => {
              field.onChange(value);
              if (onChangeSelect) {
                onChangeSelect(value);
              }
            }}
            control={<Switch checked={field.value} />}
          />
          {error?.message && (
            <FormHelperText variant="standard">{error.message}</FormHelperText>
          )}
        </FormControl>
      )}
      name={name}
      control={control}
    />
  );
};

export default ControllerSwitch;
