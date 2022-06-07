import { lazy } from 'react';
import Loadable from 'routers/Loadable';

export const ProductList = Loadable(
  lazy(() => import('views/HK_Group/Product/ProductList'))
);

export const ProductDetails = Loadable(
  lazy(() => import('views/HK_Group/Product/ProductList/Details'))
);

export const Usage = Loadable(
  lazy(() => import('views/HK_Group/Product/Type/Usage'))
);

export const TreatmentGroup = Loadable(
  lazy(() => import('views/HK_Group/Product/Type/TreatmentGroup'))
);

export const ProductGroup = Loadable(
  lazy(() => import('views/HK_Group/Product/Type/ProductGroup'))
);

export const Measure = Loadable(
  lazy(() => import('views/HK_Group/Product/Measure'))
);

export const ReferencePrices = Loadable(
  lazy(() => import('views/HK_Group/Product/ReferencePrices'))
);
