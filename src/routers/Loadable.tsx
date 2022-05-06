import LazyLoadingScreen from 'components/common/LazyLoadingScreen';
import { lazy, Suspense } from 'react';

interface Props {
  [key: string]: any;
}

type LazyComponent = ReturnType<typeof lazy>;

const Loadable = (Component: LazyComponent) => (props: Props) =>
(
  <Suspense fallback={<LazyLoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;
