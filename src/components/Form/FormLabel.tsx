import MuiFormLabel from '@mui/material/FormLabel';
import { formLabelClasses } from '@mui/material/FormLabel';
import type { FormLabelProps } from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';

interface LabelProps extends FormLabelProps {
  title: string;
  name: string;
  required?: boolean;
  gutterBottom?: boolean;
}

const FormLabel = (props: LabelProps) => {
  const { title, name, required, gutterBottom, ...rest } = props;
  return (
    <MuiFormLabel
      sx={{
        display: 'block',
        mb: gutterBottom ? '0.35em' : 0,
        [`& .${formLabelClasses.asterisk}`]: {
          color: 'error.main',
        },
      }}
      htmlFor={name}
      required={required}
      {...rest}
    >
      <Typography component="span" variant="body2">
        {title}
      </Typography>
    </MuiFormLabel>
  );
};

export default FormLabel;
