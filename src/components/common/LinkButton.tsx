import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

type RouterLinkProps = typeof RouterLink;

type LinkButtonProps = ButtonProps<
  RouterLinkProps,
  { component?: RouterLinkProps }
>;

const LinkButton = (props: LinkButtonProps) => {
  const { to, children, ...rest } = props;

  return (
    <Button
      component={RouterLink}
      to={to}
      size="small"
      variant="outlined"
      {...rest}
    >
      {children}
    </Button>
  );
};

export default LinkButton;
