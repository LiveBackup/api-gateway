export class GraphQLBody {
  query: string;
  variables?: object;
  operationName: string;
}

export type ParseGraphQL = (data?: object) => GraphQLBody;

export * from './user-ms';
