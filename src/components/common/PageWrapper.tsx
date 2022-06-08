import Container from '@mui/material/Container';
import type { FC, ReactNode } from 'react';
import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageBreadcrums } from '.';

interface Props {
  title?: string;
  children: ReactNode;
}

const PageWrapper: FC<Props> = (props) => {
  const { title = 'Transpora', children } = props;

  return (
    <Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Container
        sx={{
          height: 1,
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          rowGap: 2,
          py: 3,
          maxWidth: '1300px !important',
        }}
      >
        <PageBreadcrums />
        {children}
      </Container>
    </Fragment>
  );
};

export default PageWrapper;
