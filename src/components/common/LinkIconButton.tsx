import type { LinkProps } from '@mui/material/Link';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';

type RouterLinkProps = typeof RouterLink;

type LinkIconButtonProps = LinkProps<
  RouterLinkProps,
  { component?: RouterLinkProps }
>;

const LinkIconButton = (props: LinkIconButtonProps) => {
  const { to, children, ...rest } = props;

  return (
    <Link component={RouterLink} to={to} {...rest}>
      {children}
    </Link>
  );
};

export default LinkIconButton;
