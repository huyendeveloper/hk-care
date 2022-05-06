import type { FormGroupProps } from '@mui/material/FormGroup';
import MuiFormGroup from '@mui/material/FormGroup';
import { styled } from '@mui/material/styles';

interface Props extends FormGroupProps {
  hidden?: boolean;
  fullWidth?: boolean;
}

const FormGroup = (props: Props) => {
  const { hidden, children, fullWidth, ...rest } = props;

  if (hidden) {
    return null;
  }

  return (
    <Wrapper fullWidth={fullWidth} {...rest}>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled(MuiFormGroup, {
  shouldForwardProp: (prop: string) => !['fullWidth'].includes(prop),
})<Pick<Props, 'fullWidth'>>(({ fullWidth }) => ({
  '& + &': {
    marginTop: 16,
  },
  ...(fullWidth && {
    width: '100%',
  }),
}));

export default FormGroup;
