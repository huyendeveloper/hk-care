import { Outlet, RouteObject } from "react-router-dom";
import {
  CirculationInvoice,
  CirculationInvoiceDetail,
  CreateCirculationInvoice,
  CreateExportCancel,
  CreateImportReceipt,
  ExportCancel,
  ExportCancelDetail,
  ImportReceipt,
  ImportReceiptDetail,
} from "views/HK_Care/Warehouse";

const HKGroupRoutes: RouteObject = {
  path: "hk_care/warehouse",
  element: <Outlet />,
  children: [
    {
      path: "import",
      children: [
        {
          path: "receipt",
          children: [
            { index: true, element: <ImportReceipt /> },
            { path: "create", element: <CreateImportReceipt /> },

            { path: ":id", element: <ImportReceiptDetail /> },
            {
              path: ":id/update",
              element: <CreateImportReceipt /> 
            },
          ],
        },
      ],
    },
    {
      path: "export",
      children: [
        {
          path: "cancel",
          children: [
            { index: true, element: <ExportCancel /> },
            { path: "create", element: <CreateExportCancel /> },

            { path: ":id", element: <ExportCancelDetail /> },
            {
              path: ":id/update",
              element: <CreateExportCancel /> 
            },
          ],
        },
        {
          path: "circulation_invoice",
          children: [
            { index: true, element: <CirculationInvoice /> },
            { path: "create", element: <CreateCirculationInvoice /> },

            { path: ":id", element: <CirculationInvoiceDetail /> },
            {
              path: ":id/update",
              element: <CreateCirculationInvoice /> 
            },
          ],
        },
      ],
    },
  ],
};

export default HKGroupRoutes;
