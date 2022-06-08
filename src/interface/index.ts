export interface ILogin {
  username: string;
  password: string;
  __tenant: string | null;
  tenant: string | null;
}

export interface ILoginResponse {
  access_Token: string;
  userId: string;
}

export interface IUser {
  token: string;
}

export interface IProductGroup {
  name: string;
  description?: string;
  id: number;
}

export interface IUsage {
  name: string;
  description?: string;
  id: number;
}

export interface ITreatmentGroup {
  name: string;
  description?: string;
  id: number;
}

export interface IMeasure {
  name: string;
  description?: string;
  id: number;
}

export interface ISupplier {
  name: string;
  address?: string;
  nameContact?: string;
  telephoneNumber: string;
  mobileNumber?: string;
  fax?: string;
  taxCode?: string;
  bussinessLicense: any;
  description?: string;
  active?: number;
  id: number;
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
  dateManufacture: Date;
  productList?: any[];
  discount?: number;
  outOfDate: Date;
  amount: number;
}

export interface ITenant {
  id: string;
  name: string;
  address: string;
  hotline: string;
  status: boolean;
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
  importDate: Date;
  unitPrice: number;
  inDebt: number;
}
