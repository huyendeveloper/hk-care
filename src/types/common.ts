export interface CommonResponse<D = any> {
  data: D | null;
  httpStatusCode: number;
  success: boolean;
  total: number;
}
export interface FilterParams {
  sortDirection: Order;
  pageIndex: number;
  pageSize: number;
  sortBy: string;
  searchText: string;
  supplierId?: number;
  startDate?: Date | null;
  lastDate?: Date | null;
}
export interface Dictionary<T = any> {
  [key: string]: T;
}

export type Order = 'asc' | 'desc' | '';

export type Role =
  | 'hkl1'
  | 'hkl2'
  | 'hkl3'
  | 'hkl4'
  | 'hkl2_1'
  | 'hkl2_1_1'
  | 'hkl2_1_2'
  | 'hkl2_1_3'
  | 'hkl2_1_4'
  | 'Care.Operational.DecentralizationSale'
  | 'Care.Operational.ListOfEmployee'
  | 'Care.Operational.PharmacyRevenueReport'
  | 'Care.Product.ListOfProductsSale'
  | 'Care.SalesManager.ListOfSalesInvoices'
  | 'Care.SalesManager.Sell'
  | 'Care.Warehouse.ExportCancellation'
  | 'Care.Warehouse.ExportRotation'
  | 'Care.Warehouse.ImportWarehouse'
  | 'Care.Warehouse.RequirementForImport'
  | 'Care.Warehouse.WarehouseInventoryRecord'
  | 'CareManager.DecentralizationAdmin'
  | 'CareManager.PointOfSaleInformation'
  | 'FeatureManagement.ManageHostFeatures'
  | 'Group.DecentralizationAdmin'
  | 'Group.UserAdministration'
  | 'Group.UserListAdmin'
  | 'Product.ListOfProducts'
  | 'Product.Measure'
  | 'Product.ProductGroups'
  | 'Product.Supplier'
  | 'Product.TypeOfTreatment'
  | 'Product.UsageForm'
  | 'Trading.SummaryOfInputRequests'
  | 'empty';
