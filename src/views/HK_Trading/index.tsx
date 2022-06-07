import { lazy } from 'react';
import Loadable from 'routers/Loadable';

export const Supplier = Loadable(
  lazy(() => import('views/HK_Trading/Supplier'))
);

export const SupplierDetails = Loadable(
  lazy(() => import('views/HK_Trading/Supplier/Details'))
);
