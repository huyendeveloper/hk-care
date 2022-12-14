export interface ITenant {
  id: string;
  name: string;
  address: string;
  hotline: string;
  status: boolean;
  nameContact?: string;
  description?: string;
  phone?: string;
}

export interface ILogin {
  username: string;
  password: string;
  __tenant: string;
  tenant: string;
}

export interface IProductGroup {
  id: number;
  name: string;
  description: string;
}

export interface ITreatmentGroup {
  id: number;
  name: string;
  description: string;
}

export interface IUsage {
  id: number;
  name: string;
  description: string;
}

export interface IMeasure {
  id: number;
  name: string;
  description: string;
}

export interface ISupplier {
  id: number;
  name: string;
  address: string | null;
  nameContact: string;
  telephoneNumber: string;
  mobileNumber: string;
  fax: string;
  taxCode: string;
  bussinessLicense: any;
  description: string;
  active: 1 | 2;
  files?: File[] | object[];
}

export interface IProduct {
  image?: any;
  name: string;
  numberRegister?: number | null;
  productGroupId: number | null;
  productGroup?: string;
  importPrice: number;
  price: number;
  hidden: boolean;
  lotNumber?: number | null;
  treamentGroupId: number | null;
  outOfDate?: Date | null;
  usageId: number | null;
  mesureLevelFisrt: number | null;
  amountThird: number | null;
  mesureLevelSecond: number;
  amountSecond: number | null;
  mesureLevelThird: number;
  producer: string;
  dateManufacture: Date | null;
  productsSupplier: number[];
  packRule: string;
  content: string;
  dosage: string;
  routeOfUse: string;
  productImage: string;
  description: string;
  id: number;
  productGroupName?: string;
  treamentGroupName?: string;
  usageName?: string;
  mesureLevelFisrtName?: string;
  mesureLevelSecondName?: string;
  mesureLevelThirdName?: string;
}

export interface IProductList {
  productName: string;
  mesure: string;
  stockQuantity: number;
  productId: number;
  productGroup?: string;
  importPrice: number;
  price: number;
  status: number;
  mesureLevelFisrt: string;
  amountThird: string;
  mesureLevelSecond: string;
  amountSecond: string;
  mesureLevelThird: string;
  mesureLevelFisrtName: string;
  mesureLevelSecondName: string;
  mesureLevelThirdName: string;
  norm: number;
  id: number;
}

export interface IProductReceiptWHDtos {
  lotNumber: string;
  name: string;
  productName: string;
  mesureNameLevelFirst: string;
  measure: string;
  amount: number;
  discount: number;
  importPrice: number;
  price: number;
  numberRegister: string;
  dateManufacture: Date | string;
  expiryDate: Date | string;
}

export interface IReceipt {
  description?: string;
  productName: string;
  mesure: string;
  stockQuantity: number;
  productId: number;
  productGroup?: string;
  importPrice: number;
  price: number;
  status: number;
  mesureLevelFisrt: string;
  amountThird: string;
  mesureLevelSecond: string;
  amountSecond: string;
  mesureLevelThird: string;
  mesureLevelFisrtName: string;
  mesureLevelSecondName: string;
  mesureLevelThirdName: string;
  quantity: number;
  dateManufacture?: Date | null;
  expiryDate?: Date | null;
  productReceiptWHDtos?: IProductReceiptWHDtos[];
  discount?: number;
  amount: number;
  mesureNameLevelFirst: string;
  pathFile?: string;
  measure?: string;
  totalMoney: number;
  lotNumber?: string;
  numberRegister?: string;
  name?: string;
  vat?: number;
  discountValue?: number;
  paid?: number;
  __tenant?: string;
  outOfDate: Date;
}

export interface IReferencePricesMock {
  id: number;
  name: string;
  mesure: string;
  type: string;
  importPrice: number;
  price: number;
}

export interface IImportReceipt {
  id: number;
  creationTime: Date;
  moneyToPay: number;
  debts: number;
  code: string;
}

export interface OrderDetailDtos {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  measureId: number;
  measureName: string;
  discount: number;
  mor: string;
  noon: string;
  night: string;
  description: string;
  billPerProduct: number;
  total: number;
}

export interface ISalesOrder {
  id: number;
  saleDate: Date;
  customer: string;
  type: string;
  saler: string;
  pay: number;
  code: string;
  customerName: string;
  orderType: number;
  userName: string;
  giveMoney: number;
  totalMoney: number;
  orderId: number;
  disCount: number;
  description: string;
  orderDetailDtos: OrderDetailDtos[];
  discountValue: number;
  name?: string;
  telephoneNumber: string;
  images: { name: string; url: string }[];
  tenantPhone: string;
  tenantAddress: string;
}

export interface OrderSales {
  id: number;
  disCount: number;
  giveMoney: number;
  description: string;
  orderDetailDtos: {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    measureId: number;
    measureName: string;
    discount: number;
    mor: string;
    noon: string;
    night: string;
    description: string;
    billPerProduct: number;
  }[];
}

export interface ISearchProduct {
  productId: number;
  productName: string;
  priceLevelFirst: number;
  mesureNameLevelFirst: string;
  priceLevelSecond: number;
  mesureNameLevelSecond: string;
  priceLevelThird: number;
  mesureNameLevelThird: string;
  productImage: string;
  stockQuantity: number;
  routeOfUse: string;
  quantity?: number;
  discount?: number;
  price?: number;
}

export interface IProductExportCancel {
  measureName: string;
  amount: number;
  importPrice: number;
  lotNumber: string;
  numberRegister: string;
  expiryDate: Date;
  dateManufacture: Date;
  productId: number;
  productName: string;
  id: number;
  creationTime: Date;
  cancellationPrice: number;
  code: string;
  exportWHId: number;
  maxQuantity: number;
  rowId?: number;
}

export interface IExportCancel {
  totalFee: number;
  code: string;
  description: string;
  from: number;
  to: number;
  exportType: number;
  creationTime: Date;
  id: number;
  rotationPoint: string;
  exportWHDetails: IProductExportCancel[];
}

export interface IExportWHRotation {
  id: number;
  totalFee: number;
  code: string;
  description: string;
  from: number;
  to: number;
  exportType: number;
  rotationPoint: string;
  exportWHId: number;
  exportWHDetails: IProductExportCancel[];
  __tenant: string;
}

export interface IProductRequestImport {
  name: string;
  measureName: string;
  budget: number;
  addBudget: number;
}

export interface IRequestImport {
  id: number;
  code: string;
  expectedDate?: Date;
  description?: string;
  tenant?: string;
  quantity?: number;
  expectedDetails?: IProductRequestImport[];
  measureName?: string;
  requestDate?: Date;
}

export interface INorm {
  id: number;
  productName: string;
  measureName: string;
  groupProductName: string;
  stockQuantity: number;
  importPrice: number;
  price: number;
  norm: number;
}

export interface IInventoryRecordProduct {
  name: string;
  unit: string;
  productListId: number;
  amountOld: number;
  amountNew: number;
  priceImport: number;
  priceExport: number;
  productId: number;
}
export interface IInventoryRecordProductShow extends IInventoryRecordProduct {
  id: number;
  quantityDifference: number;
  moneyDifference: number;
  estimatedRevenue: number;
}

export interface InventoryItemDto {
  codeInventory: string;
  createBy: string;
  createByName: string;
  createByOnUtc: Date;
  totalRevenue: number;
}

export interface IInventoryRecord {
  id: number;
  code: string;
  date: Date;
  staff: string;
  totalRevenueDiff: number;
  note?: string;
  items?: IInventoryRecordProduct[];
}

export interface IUser {
  token?: string;
  name: string;
  phone: string;
  email?: string;
  roleId: string;
  roleName: string;
  userName: string;
  password: string;
  tenant: string;
  isActive: boolean;
  id: number;
  role: string[];
}

export interface IRole {
  id?: number;
  idRole?: string;
  roleId?: string;
  roleName: string;
  qlsp: boolean;
  qlkh: boolean;
  qlbh: boolean;
  qlvh: boolean;
}

export interface RoleMappingDto {
  roleId: string;
  roleName: string;
}

export interface HkGroupDto {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string[];
  accountName: string;
  password: string;
  isActive: boolean;
}

export interface IRevenueReport {
  code: string;
  employeeName: string;
  saleDate: Date;
  orderValue: number;
  saleDateFormated: string;
}

export interface IRevenueReportStaff {
  code: string;
  employeeName: string;
  saleDate: Date;
  orderValue: number;
}

export interface IStaff {
  id: string;
  name: string;
  roleId?: string;
  role?: string[];
  roleName?: string;
  phoneNumber?: string;
  active?: number;
  idCard?: string;
  email?: string;
  userName?: string;
  password?: string;
  status?: number;
  userId?: string;
  phone: string;
  namePathSalePointEmployeeStorageDtos?: { name: string; url: string }[];
  files?: { name: string; url: string }[];
}

export interface ISalesReport {
  id: number;
  code: string;
  employeeName: string;
  saleDate: Date;
  orderValue: number;
}

export interface IWhInventory {
  id: number;
}
