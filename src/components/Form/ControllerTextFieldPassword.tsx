import { VisibilityOff } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton/IconButton';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import '../../index.css'

interface Props<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  control?: Control<T>;
  name: FieldPath<T>;
}

const ControllerTextFieldPassword = <T extends FieldValues>(props: Props<T>) => {
  const { control, name, ...rest } = props;
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [values, setValues] = useState<string>('');

  const _handleClickShowPassword = () => {
    setValues(values);
    setShowPassword(!showPassword);
  };

  return (
    <Controller
      render={({ field, fieldState: { error } }) => (
        <div style={{ display: 'flex', position: 'relative', alignItems: 'flex-start' }}>
          <TextField
            className='ILaAqXVruB'
            id={name}
            fullWidth
            type={showPassword ? 'password' : 'text'}
            error={Boolean(error)}
            helperText={error?.message && error.message}
            {...field}
            {...rest}
          />
          <IconButton
            aria-label="toggle password visibility"
            style={{
              position: 'absolute',
              right: 3,
              top: 3
            }}
            onClick={_handleClickShowPassword}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </div>
      )}
      name={name}
      control={control}
    />
  );
};

export default ControllerTextFieldPassword;
