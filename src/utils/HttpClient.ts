import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { baseURL } from 'config';
import LocalStorage from './LocalStorage';

const headers: AxiosRequestConfig['headers'] = {
  'Content-Type': 'application/json',
};

class Axios {
  private httpInstance: AxiosInstance;

  constructor() {
    const httpInstance = axios.create({
      baseURL,
      headers,
    });

    // Request interceptor
    httpInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const accessToken = LocalStorage.get('accessToken');
        if (config.headers) {
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          } else {
            delete config.headers.Authorization;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    httpInstance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error: AxiosError) => Promise.reject(error)
    );

    this.httpInstance = httpInstance;
  }

  public get HttpClient(): AxiosInstance {
    return this.httpInstance;
  }

  public post<T = any, R = T>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.HttpClient.post<T, R>(url, data, config);
  }

  public get<T = any, R = T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.HttpClient.get<T, R>(url, config);
  }

  public delete<T = any, R = T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.HttpClient.delete<T, R>(url, config);
  }
}

const { HttpClient } = new Axios();

export const mock = new MockAdapter(HttpClient, { delayResponse: 1000 });

export default HttpClient;
