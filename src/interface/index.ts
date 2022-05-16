export interface ILogin {
  userName: string;
  passWord: string;
}

export interface LoginResponse {
  access_Token: string;
  userId: string;
}

export interface IUser {
  token: string;
}
