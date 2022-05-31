import { lazy } from 'react';
import Loadable from 'routers/Loadable';

export const ProductList = Loadable(
  lazy(() => import('views/HK_Care/Product/ProductList'))
);

export const ProductListCreate = Loadable(
  lazy(() => import('views/HK_Care/Product/ProductList/Create'))
);

export const ProductDetails = Loadable(
  lazy(() => import('views/HK_Care/Product/ProductList/Details'))
);
