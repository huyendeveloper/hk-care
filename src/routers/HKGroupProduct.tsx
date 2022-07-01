import { Outlet, RouteObject } from "react-router-dom";
import {
  ProductDetails,
  ProductList,
  ReferencePrices
} from "views/HK_Group/Product";

const HKGroupRoutes: RouteObject = {
  path: "hk_group/product",
  element: <Outlet />,
  children: [
    {
      path: "list",
      children: [
        { index: true, element: <ProductList /> },
        { path: ":id", element: <ProductDetails /> },
      ],
    },
    {
      path: "reference_prices",
      children: [{ index: true, element: <ReferencePrices /> }],
    },
  ],
};

export default HKGroupRoutes;
