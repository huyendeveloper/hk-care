import { lazy } from 'react';
import Loadable from 'routers/Loadable';

export const ImportReceipt = Loadable(
  lazy(() => import('views/HK_Care/Warehouse/Import/Receipt'))
);

export const CreateImportReceipt = Loadable(
  lazy(() => import('views/HK_Care/Warehouse/Import/Receipt/Create'))
);

export const ImportReceiptDetail = Loadable(
  lazy(() => import('views/HK_Care/Warehouse/Import/Receipt/Details'))
);

export const ExportCancel = Loadable(
  lazy(() => import('views/HK_Care/Warehouse/Export/Cancel'))
);

export const CreateExportCancel = Loadable(
  lazy(() => import('views/HK_Care/Warehouse/Export/Cancel/Create'))
);

export const ExportCancelDetail = Loadable(
  lazy(() => import('views/HK_Care/Warehouse/Export/Cancel/Details'))
);

export const CirculationInvoice = Loadable(
  lazy(() => import('views/HK_Care/Warehouse/Export/CirculationInvoice'))
);

export const CreateCirculationInvoice = Loadable(
  lazy(() => import('views/HK_Care/Warehouse/Export/CirculationInvoice/Create'))
);

export const CirculationInvoiceDetail = Loadable(
  lazy(
    () => import('views/HK_Care/Warehouse/Export/CirculationInvoice/Details')
  )
);
