import type { LinkProps } from '@mui/material/Link';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';

type RouterLinkProps = typeof RouterLink;

type RouteLinkProps = LinkProps<
  RouterLinkProps,
  { component?: RouterLinkProps }
>;

const RouteLink = (props: RouteLinkProps) => {
  const { to, children, ...rest } = props;

  return (
    <Link component={RouterLink} to={to} underline="none" {...rest}>
      {children}
    </Link>
  );
};

export default RouteLink;
