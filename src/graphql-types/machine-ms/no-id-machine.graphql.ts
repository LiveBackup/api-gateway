import {field, objectType} from '@loopback/graphql';

@objectType({description: 'Machine object without id attribute'})
export class NoIdMachine {
  @field(() => String)
  name: string;

  @field(() => String)
  accountId: string;
}
