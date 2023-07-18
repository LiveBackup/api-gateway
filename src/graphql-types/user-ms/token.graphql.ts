import {field, objectType} from '@loopback/graphql';

@objectType({description: 'Authorization token'})
export class Token {
  @field(() => String)
  token: string;
}
