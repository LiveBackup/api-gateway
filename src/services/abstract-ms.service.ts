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
