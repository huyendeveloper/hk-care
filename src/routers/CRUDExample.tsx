import { lazy } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import Loadable from './Loadable';

const CRUDExample = Loadable(lazy(() => import('views/Example/CRUD')));
const CreateCRUD = Loadable(lazy(() => import('views/Example/CRUD/Create')));
const EditCRUD = Loadable(lazy(() => import('views/Example/CRUD/Edit')));
const DetailsCRUD = Loadable(lazy(() => import('views/Example/CRUD/Details')));

const CRUDRoutes: RouteObject = {
  path: 'example',
  element: <Outlet />,
  children: [
    {
      path: 'crud',
      children: [
        { index: true, element: <CRUDExample /> },
        { path: 'create', element: <CreateCRUD /> },
        { path: ':id', element: <DetailsCRUD /> },
        { path: ':id/edit', element: <EditCRUD /> },
      ],
    },
  ],
};

export default CRUDRoutes;
