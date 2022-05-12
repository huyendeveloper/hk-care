import Box from '@mui/material/Box';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import breadcrumbConfig from 'breadcrumbConfig';
import { Link as RouterLink } from 'react-router-dom';
import useReactRouterBreadcrumbs from 'use-react-router-breadcrumbs';

export interface Breadcrumb {
  text: string;
  link: string;
}

const PageBreadcrumbs = () => {
  const breadcrumbs: Breadcrumb[] = useReactRouterBreadcrumbs(
    breadcrumbConfig,
    { disableDefaults: true }
  ).map(({ match }) => {
    return { text: match?.route?.breadcrumb as string, link: '#' };
  });

  return (
    <Box>
      <Breadcrumbs
        separator="›"
        sx={{
          [`& > .${breadcrumbsClasses.ol}`]: {
            alignItems: 'baseline',
          },
        }}
      >
        {breadcrumbs.map((item, i) => {
          const { text, link } = item;
          return (
            <Link
              key={i}
              component={RouterLink}
              to={link}
              color={'text.primary'}
              variant="subtitle2"
            >
              {text}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default PageBreadcrumbs;
