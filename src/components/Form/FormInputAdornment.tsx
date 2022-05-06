import type { InputAdornmentProps } from '@mui/material/InputAdornment';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';

interface Props extends Omit<InputAdornmentProps, 'title'> {
  title: string;
  disabled?: boolean;
  visible?: boolean;
}

const FormInputAdornment = (props: Props) => {
  const { title, disabled, visible, position = 'start', ...rest } = props;

  if (disabled && !visible) {
    return null;
  }

  return (
    <InputAdornment position={position} {...rest}>
      <Typography
        color={disabled ? 'text.disabled' : 'text.primary'}
        sx={{ lineHeight: 'revert', minWidth: '3ch' }}
      >
        {title}
      </Typography>
    </InputAdornment>
  );
};

export default FormInputAdornment;
