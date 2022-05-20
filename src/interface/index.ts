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
  id: number;
  name: string;
  address?: string;
  contactName?: string;
  phone: string;
  status: boolean;
  phone2?: string;
  description?: string;
  fax?: string;
  taxCode?: string;
  certificate: string;
}

export interface IProduct {
  id: number;
  name: string;
  group: string;
  priceBuy: number;
  priceSale: number;
  active: boolean;
  date?: Date;
}

export interface ITenant {
  id: string;
  name: string;
}
