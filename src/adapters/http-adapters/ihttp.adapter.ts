import {GraphQLError} from '../../services';

export type HttpResponse<ResponseType> = {
  status: number;
  data: ResponseType;
};

export type HttpBadResponse = {
  error: {
    statusCode: number;
    message: string;
    details?: Array<object>;
  };
};

export interface IHttpAdapter {
  setToken(token: string): void;
  get<ResponseType>(url: string): Promise<HttpResponse<ResponseType>>;
  post<ResponseType>(
    url: string,
    payload?: object,
  ): Promise<HttpResponse<ResponseType>>;
  put<ResponseType>(
    url: string,
    payload?: object,
  ): Promise<HttpResponse<ResponseType>>;
  patch<ResponseType>(
    url: string,
    payload?: object,
  ): Promise<HttpResponse<ResponseType>>;
  delete<ResponseType>(url: string): Promise<HttpResponse<ResponseType>>;
}

export abstract class IHttpAdapter implements IHttpAdapter {
  protected handleResponse<T>(response: HttpResponse<T>): void {
    // If response status is larger of equal than 400 then the request failed
    if (response.status >= 400) {
      const errorBody = response.data as HttpBadResponse;
      const {message, statusCode, details} = errorBody.error;
      throw new GraphQLError(message, statusCode, details);
    }
  }
}
