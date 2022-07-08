import { lazy } from "react";
import { Outlet, RouteObject } from "react-router-dom";
import Loadable from "./Loadable";

const SalesOrder = Loadable(lazy(() => import("views/HK_Care/Sales/Order")));
const SalesOrderDetail = Loadable(lazy(() => import("views/HK_Care/Sales/Order/Details")));
const ImportReceipt = Loadable(lazy(() => import("views/HK_Care/Warehouse/Import/Receipt")));
const CreateImportReceipt = Loadable(lazy(() => import("views/HK_Care/Warehouse/Import/Receipt/Create")));
const ImportReceiptDetail = Loadable(lazy(() => import("views/HK_Care/Warehouse/Import/Receipt/Details")));
const ExportCancel = Loadable(lazy(() => import("views/HK_Care/Warehouse/Export/Cancel")));
const CreateExportCancel = Loadable(lazy(() => import("views/HK_Care/Warehouse/Export/Cancel/Create")));
const ExportCancelDetail = Loadable(lazy(() => import("views/HK_Care/Warehouse/Export/Cancel/Details")));
const CirculationInvoice = Loadable(lazy(() => import("views/HK_Care/Warehouse/Export/CirculationInvoice")));
const CreateCirculationInvoice = Loadable(lazy(() => import("views/HK_Care/Warehouse/Export/CirculationInvoice/Create")));
const CirculationInvoiceDetail = Loadable(lazy(() => import("views/HK_Care/Warehouse/Export/CirculationInvoice/Details")));
const ProductList = Loadable(lazy(() => import('views/HK_Care/Product/ProductList')));
const ProductListCreate = Loadable(lazy(() => import('views/HK_Care/Product/ProductList/Create')));
const ProductDetails = Loadable(lazy(() => import('views/HK_Care/Product/ProductList/Details')));
const RequestImport = Loadable(lazy(() => import('views/HK_Care/Warehouse/Request')));
const CreateRequestImport = Loadable(lazy(() => import('views/HK_Care/Warehouse/Request/Create')));

const HKCareRoutes: RouteObject = {
  path: "hk_care",
  element: <Outlet />,
  children: [
    {
      path: "sales/order",
      children: [{ index: true, element: <SalesOrder /> }],
    },
    {
      path: "sales/order/:id",
      children: [{ index: true, element: <SalesOrderDetail /> }],
    },
    {
      path: "warehouse/import/receipt",
      children: [{ index: true, element: <ImportReceipt /> }],
    },
    {
      path: "warehouse/import/receipt/create",
      children: [{ index: true, element: <CreateImportReceipt /> }],
    },
    {
      path: "warehouse/import/receipt/:id",
      children: [{ index: true, element: <ImportReceiptDetail /> }],
    },
    {
      path: "warehouse/import/receipt/:id/update",
      children: [{ index: true, element: <CreateImportReceipt /> }],
    },
    {
      path: "warehouse/export/cancel",
      children: [{ index: true, element: <ExportCancel /> }],
    },
    {
      path: "warehouse/export/cancel/create",
      children: [{ index: true, element: <CreateExportCancel /> }],
    },
    {
      path: "warehouse/export/cancel/:id",
      children: [{ index: true, element: <ExportCancelDetail /> }],
    },
    {
      path: "warehouse/export/cancel/:id/update",
      children: [{ index: true, element: <CreateExportCancel /> }],
    },
    {
      path: "warehouse/export/circulation_invoice",
      children: [{ index: true, element: <CirculationInvoice /> }],
    },
    {
      path: "warehouse/export/circulation_invoice/create",
      children: [{ index: true, element: <CreateCirculationInvoice /> }],
    },
    {
      path: "warehouse/export/circulation_invoice/:id/:exportWHId",
      children: [{ index: true, element: <CirculationInvoiceDetail /> }],
    },
    {
      path: "warehouse/export/circulation_invoice/:id/:exportWHId/update",
      children: [{ index: true, element: <CreateCirculationInvoice /> }],
    },
    {
      path: "product/list",
      children: [{ index: true, element: <ProductList /> }],
    },
    {
      path: "product/list/create",
      children: [{ index: true, element: <ProductListCreate /> }],
    },
    {
      path: "product/list/:id",
      children: [{ index: true, element: <ProductDetails /> }],
    },
    {
      path: "warehouse/request",
      children: [{ index: true, element: <RequestImport /> }],
    },
    {
      path: "warehouse/request/:id",
      children: [{ index: true, element: <CreateRequestImport /> }],
    },
    {
      path: "warehouse/request/create",
      children: [{ index: true, element: <CreateRequestImport /> }],
    },
  ],
};

export default HKCareRoutes;
