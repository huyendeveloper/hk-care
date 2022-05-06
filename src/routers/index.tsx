import PrivateRoute from "components/common/PrivateRoute";
import PublicRoute from "components/common/PublicRoute";
import DashboardLayout from "layouts/Dashboard";
import MainLayout from 'layouts/Main';
import { lazy } from 'react';
import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import CRUDRoutes from "./CRUDExample";
import Loadable from './Loadable';
import UserRoutes from "./User";

// Authentication
const Login = Loadable(lazy(() => import('views/Login')));

const Home = Loadable(lazy(() => import('views/Home')));

const routes: RouteObject[] = [
  {
    path: 'login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  /* if has other public route, */
  /* pust it in PublicRoute component look like login route */

  /*if route need dashboard or header layout, push it in PrivateRote */
  {
    path: '/',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      CRUDRoutes,
      UserRoutes
      //if has other Routes, push it in here
    ]
  },

  //every route not defined
  {
    path: '*',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/" /> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
]

const Router = () => {
  const element = useRoutes(routes);
  return element;
};

export default Router;
