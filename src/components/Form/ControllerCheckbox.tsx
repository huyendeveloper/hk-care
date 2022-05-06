import type { CheckboxProps } from '@mui/material/Checkbox';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';

type Props = {
  errors?: FieldErrors;
  error?: boolean;
  control: Control<any>;
  name: string;
  label: string;
} & CheckboxProps;

const ControllerCheckbox = (props: Props) => {
  const { errors, error, control, name, label, ...rest } = props;

  return (
    <Controller
      render={({ field }) => (
        <FormControlLabel
          control={<Checkbox {...field} {...rest} />}
          label={<Typography variant="subtitle2">{label}</Typography>}
        />
      )}
      name={name}
      control={control}
    />
  );
};

export default ControllerCheckbox;
