export interface ILogin {
  username: string;
  password: string;
  __tenant: string | null;
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
  fileValue?: any;
}

export interface IProduct {
  image?: any;
  name: string;
  numberRegister?: number;
  productGroupId: number | null;
  productGroup?: string;
  importPrice: number;
  price: number;
  hidden: boolean;
  lotNumber?: number;
  treamentGroupId: number | null;
  outOfDate?: Date;
  usageId: number | null;
  mesureLevelFisrt: number | null;
  amountFirst: number | null;
  mesureLevelSecond: number;
  amountSecond: number;
  mesureLevelThird: number;
  producer: string;
  dateManufacture: Date;
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

export interface ITenant {
  id: string;
  name: string;
}
