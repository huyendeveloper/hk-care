export interface ILogin {
  userName: string;
  passWord: string;
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
  description: string;
  id: number;
}

export interface IUsage {
  name: string;
  description: string;
  id: number;
}
