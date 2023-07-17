import {Axios, AxiosResponse} from 'axios';

export type MsHttpError = {
  error: {
    statusCode: number;
    message: string;
    details?: Array<object>;
  };
};

export class GraphQLError extends Error {
  statusCode: number;
  details?: Array<object>;

  constructor(msg: string, statusCode: number, details?: Array<object>) {
    super(msg);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export abstract class AbstractMsService {
  public readonly client: Axios;

  constructor(url: string, contentTypeHeader?: string) {
    this.client = new Axios({
      baseURL: url,
      timeout: 5000,
      headers: {
        'Content-Type': contentTypeHeader ?? 'application/json',
      },
      transformRequest: (data: object) => {
        return JSON.stringify(data);
      },
      transformResponse: (data: string) => {
        return JSON.parse(data);
      },
    });
  }

  handleResponse<T>(response: AxiosResponse): T {
    // If response status if grather of equal than 400 then request failed
    if (response.status >= 400) {
      const errorBody = response.data as MsHttpError;
      const {message, statusCode, details} = errorBody.error;
      throw new GraphQLError(message, statusCode, details);
    }
    return response.data as T;
  }
}
