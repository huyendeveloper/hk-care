import NProgress from 'nprogress';
import type { FC } from 'react';
import { useEffect } from 'react';

const LazyLoadingScreen: FC = () => {
  NProgress.configure({ showSpinner: false });

  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);

  return null;
};

export default LazyLoadingScreen;
