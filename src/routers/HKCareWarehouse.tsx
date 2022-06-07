import { Outlet, RouteObject } from "react-router-dom";
import { CreateImportReceipt, ImportReceipt } from "views/HK_Care/Warehouse";

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
          ],
        },
      ],
    },
  ],
};

export default HKGroupRoutes;
