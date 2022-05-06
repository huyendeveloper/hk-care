import Box from '@mui/material/Box';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

interface Breadcrumb {
  text: string;
  link: string;
}

interface Props {
  category?: string;
  breadcrumbs: Breadcrumb[];
  title: string;
}

const PageBreadcrumbs = (props: Props) => {
  const { title, breadcrumbs, category } = props;

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
        {category && <Typography variant="subtitle2">{category}</Typography>}
        {breadcrumbs.map((item, i) => {
          const { text, link } = item;
          return (
            <Link
              key={i}
              component={RouterLink}
              to={link}
              color={!category && i === 0 ? 'text.secondary' : 'text.primary'}
              variant="subtitle2"
            >
              {text}
            </Link>
          );
        })}
        <Typography color="text.primary" variant="subtitle2">
          {title}
        </Typography>
      </Breadcrumbs>
    </Box>
  );
};

export default PageBreadcrumbs;
