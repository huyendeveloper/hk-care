import { lazy } from "react";
import { Outlet, RouteObject } from "react-router-dom";
import Loadable from "./Loadable";

const ProductGroup = Loadable(lazy(() => import('views/HK_Group/Product/Type/ProductGroup')));
const TreatmentGroup = Loadable(lazy(() => import('views/HK_Group/Product/Type/TreatmentGroup')));
const Usage = Loadable(lazy(() => import('views/HK_Group/Product/Type/Usage')));
const Measure = Loadable(lazy(() => import('views/HK_Group/Product/Measure')));
const Supplier = Loadable(lazy(() => import('views/HK_Group/Product/Supplier')));
const SupplierDetails = Loadable(lazy(() => import('views/HK_Group/Product/Supplier/Details')));
const Tenant = Loadable(lazy(() => import("views/HK_Group/Tenant")));

const HKGroupRoutes: RouteObject = {
  path: "hk_group",
  element: <Outlet />,
  children: [
    {
      path: "product/type/product_group",
      children: [{ index: true, element: <ProductGroup /> }],
    },
    {
      path: "product/type/treatment_group",
      children: [{ index: true, element: <TreatmentGroup /> }],
    },
    {
      path: "product/type/usage",
      children: [{ index: true, element: <Usage /> }],
    },
    {
      path: "product/measure",
      children: [{ index: true, element: <Measure /> }],
    },
    {
      path: "product/supplier",
      children: [{ index: true, element: <Supplier /> }],
    },
    {
      path: "product/supplier/:id",
      children: [{ element: <SupplierDetails /> }],
    },
    {
      path: "tenant",
      children: [{ index: true, element: <Tenant /> }],
    },
  ],
};

export default HKGroupRoutes;
