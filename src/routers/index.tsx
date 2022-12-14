import PrivateRoute from "components/common/PrivateRoute";
import PublicRoute from "components/common/PublicRoute";
import DashboardLayout from "layouts/Dashboard";
import MainLayout from "layouts/Main";
import { lazy } from "react";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";
import HKCare from './HKCare';
import HKGroup from "./HKGroup";
import HKTrading from "./HKTrading";
import Loadable from "./Loadable";
import UserRoutes from "./User";

const Login = Loadable(lazy(() => import("views/Login")));
const NotFound = Loadable(lazy(() => import("views/NotFound")));
const Home = Loadable(lazy(() => import("views/Home")));
const CreateSalesOrder = Loadable(lazy(() => import('views/HK_Care/Sales/Order/Create')));
const PrintSalesOrder = Loadable(lazy(() => import('views/HK_Care/Sales/Order/Print')));

const routes: RouteObject[] = [
  {
    path: "login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "404",
    element: (
      <PrivateRoute>
        <NotFound />
      </PrivateRoute>
    ),
  },
  {
    path: "/hk_care/sales/order/create",
    element: (
      <PrivateRoute>
        <CreateSalesOrder />
      </PrivateRoute>
    ),
  },
  {
    path: "/hk_care/sales/order/:id/update",
    element: (
      <PrivateRoute>
        <CreateSalesOrder />
      </PrivateRoute>
    ),
  },
  {
    path: "/hk_care/sales/order/:id/print",
    element: (
      <PrivateRoute>
        <PrintSalesOrder />
      </PrivateRoute>
    ),
  },
  /* if has other public route, */
  /* pust it in PublicRoute component look like login route */

  /*if route need dashboard or header layout, push it in PrivateRote */
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      UserRoutes,
      HKCare,
      HKTrading,
      HKGroup,
    ],
  },

  {
    path: "*",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/" /> },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
];

const Router = () => {
  const element = useRoutes(routes);
  return element;
};

export default Router;
