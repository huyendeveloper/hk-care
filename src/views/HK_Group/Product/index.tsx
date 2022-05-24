import { lazy } from 'react';
import Loadable from 'routers/Loadable';

export const ProductList = Loadable(
  lazy(() => import('views/HK_Group/Product/ProductList'))
);

// export const ProductDetails = Loadable(
//   lazy(() => import('views/HK_Group/Product/ProductList/Details'))
// );

export const Usage = Loadable(
  lazy(() => import('views/HK_Group/Product/Type/Usage'))
);

export const UsageDetails = Loadable(
  lazy(() => import('views/HK_Group/Product/Type/Usage/Details'))
);

export const TreatmentGroup = Loadable(
  lazy(() => import('views/HK_Group/Product/Type/TreatmentGroup'))
);

export const TreatmentGroupDetails = Loadable(
  lazy(() => import('views/HK_Group/Product/Type/TreatmentGroup/Details'))
);

export const ProductGroup = Loadable(
  lazy(() => import('views/HK_Group/Product/Type/ProductGroup'))
);

export const ProductGroupDetails = Loadable(
  lazy(() => import('views/HK_Group/Product/Type/ProductGroup/Details'))
);

export const Measure = Loadable(
  lazy(() => import('views/HK_Group/Product/Measure'))
);

export const MeasureDetails = Loadable(
  lazy(() => import('views/HK_Group/Product/Measure/Details'))
);

export const Supplier = Loadable(
  lazy(() => import('views/HK_Group/Product/Supplier'))
);

export const SupplierDetails = Loadable(
  lazy(() => import('views/HK_Group/Product/Supplier/Details'))
);
