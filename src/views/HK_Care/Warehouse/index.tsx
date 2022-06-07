import { lazy } from 'react';
import Loadable from 'routers/Loadable';

export const ImportReceipt = Loadable(
  lazy(() => import('views/HK_Care/Warehouse/Import/Receipt'))
);

export const CreateImportReceipt = Loadable(
  lazy(() => import('views/HK_Care/Warehouse/Import/Receipt/Create'))
);
