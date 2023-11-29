import {field, objectType} from '@loopback/graphql';
import {NoKeysMachine} from './no-keys-machine.graphql';

@objectType({description: 'Machine object without id attribute'})
export class NoIdMachine extends NoKeysMachine {
  @field(() => String)
  accountId: string;
}
