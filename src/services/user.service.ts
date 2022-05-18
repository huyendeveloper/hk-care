import axios, { AxiosRequestHeaders } from 'axios';
import { baseURL } from 'config';
import authHeader from './auth-header';
import axiosClient from 'api';

class UserService {
  getRoles(id: string) {
    return axiosClient.get(
      `${baseURL}/identity/roles/GetRoleByUser?userId=${id}`
    );
  }
}

export default new UserService();
