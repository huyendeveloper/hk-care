import FormControl from '@mui/material/FormControl';
import type { FormControlLabelProps } from '@mui/material/FormControlLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Radio from '@mui/material/Radio';
import type { RadioGroupProps } from '@mui/material/RadioGroup';
import RadioGroup from '@mui/material/RadioGroup';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

export interface Option {
  value: number;
  label: string;
}

interface Props<T> extends Omit<FormControlLabelProps, 'control' | 'label'> {
  control: Control<T>;
  name: FieldPath<T>;
  options: Option[];
  row?: RadioGroupProps['row'];
  onChangeSelect?: (value: number | null) => void;
}

const ControllerRadio = <T extends FieldValues>(props: Props<T>) => {
  const { control, name, options, row, onChangeSelect, ...rest } = props;

  return (
    <Controller
      render={({ field, fieldState: { error } }) => (
        <FormControl error={Boolean(error)}>
          <RadioGroup
            row={row}
            {...field}
            onChange={(_event, value: string | null) => {
              field.onChange(value);
              if (onChangeSelect) {
                if (typeof value === 'string') {
                  onChangeSelect(parseInt(value));
                } else {
                  onChangeSelect(value);
                }
              }
            }}
          >
            {options.map(({ value, label }) => (
              <FormControlLabel
                {...rest}
                key={value}
                value={value}
                control={<Radio size="small" />}
                label={label}
              />
            ))}
          </RadioGroup>
          <FormHelperText variant="standard">{error?.message}</FormHelperText>
        </FormControl>
      )}
      name={name}
      control={control}
    />
  );
};

export default ControllerRadio;
