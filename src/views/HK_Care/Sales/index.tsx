import { lazy } from 'react';
import Loadable from 'routers/Loadable';

export const SalesOrder = Loadable(
  lazy(() => import('views/HK_Care/Sales/Order'))
);

export const CreateSalesOrder = Loadable(
  lazy(() => import('views/HK_Care/Sales/Order/Create'))
);

// export const ImportReceiptDetail = Loadable(
//   lazy(() => import('views/HK_Care/Warehouse/Import/Receipt/Details'))
// );
