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
  address: string;
  nameContact: string;
  telephoneNumber: string;
  mobileNumber: string;
  fax: string;
  taxCode: string;
  bussinessLicense: any;
  description: string;
  active: number;
  lastModificationTime: Date;
  lastModifierId: Date;
  creationTime: string;
  creatorId: string;
  id: number;
}

export interface IProduct {
  id: number;
  name: string;
  group: string;
  priceBuy: number;
  priceSale: number;
  active: boolean;
  date?: Date;
  productGroup?: number;
  treatmentGroup?: number;
  usage?: number;
  phone?: number;
}

export interface ITenant {
  id: string;
  name: string;
}
