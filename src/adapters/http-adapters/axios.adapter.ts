import {BindingScope, injectable} from '@loopback/core';
import {Axios} from 'axios';
import {HttpResponse, IHttpAdapter} from './ihttp.adapter';

@injectable({scope: BindingScope.TRANSIENT})
export class AxiosAdapter extends IHttpAdapter {
  private client: Axios;

  constructor(baseURL: string) {
    super();
    this.client = new Axios({
      baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
      transformRequest: (data: object) => {
        return JSON.stringify(data);
      },
      transformResponse: (data?: string) => {
        if (data) return JSON.parse(data);
      },
    });
  }

  setToken(token: string): void {
    this.client.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  async get<ResponseType>(url: string): Promise<HttpResponse<ResponseType>> {
    const {status, data} = await this.client.get<ResponseType>(url);
    const response = {status, data};
    super.handleResponse<ResponseType>(response);
    return response;
  }

  async post<ResponseType>(
    url: string,
    payload?: object,
  ): Promise<HttpResponse<ResponseType>> {
    const {status, data} = await this.client.post<ResponseType>(url, payload);
    const response = {status, data};
    super.handleResponse<ResponseType>(response);
    return response;
  }

  async put<ResponseType>(
    url: string,
    payload?: object,
  ): Promise<HttpResponse<ResponseType>> {
    const {status, data} = await this.client.put<ResponseType>(url, payload);
    const response = {status, data};
    super.handleResponse<ResponseType>(response);
    return response;
  }

  async patch<ResponseType>(
    url: string,
    payload?: object,
  ): Promise<HttpResponse<ResponseType>> {
    const {status, data} = await this.client.patch<ResponseType>(url, payload);
    const response = {status, data};
    super.handleResponse<ResponseType>(response);
    return response;
  }

  async delete<ResponseType>(url: string): Promise<HttpResponse<ResponseType>> {
    const {status, data} = await this.client.delete<ResponseType>(url);
    const response = {status, data};
    super.handleResponse<ResponseType>(response);
    return response;
  }
}
