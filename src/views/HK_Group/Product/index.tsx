import { lazy } from 'react';
import Loadable from 'routers/Loadable';

export const ProductList = Loadable(
  lazy(() => import('views/HK_Group/Product/ProductList'))
);

export const ProductDetails = Loadable(
  lazy(() => import('views/HK_Group/Product/ProductList/Details'))
);

export const ReferencePrices = Loadable(
  lazy(() => import('views/HK_Group/Product/ReferencePrices'))
);
