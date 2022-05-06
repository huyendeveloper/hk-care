import type { FC } from 'react';
import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
}

const Page: FC<Props> = (props) => {
  const { title = 'Transpora', children } = props;
  return (
    <Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </Fragment>
  );
};

export default Page;
