import {ID, field, objectType} from '@loopback/graphql';
import {NoIdMachine} from './no-id-machine.graphql';

@objectType({description: 'Machine object'})
export class Machine extends NoIdMachine {
  @field(() => ID)
  id: string;
}
