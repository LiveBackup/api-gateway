import {inject} from '@loopback/core';
import {
  GraphQLBindings,
  ResolverData,
  arg,
  authorized,
  mutation,
  query,
  resolver,
} from '@loopback/graphql';
import {securityId} from '@loopback/security';
import {MSContextType} from '../../checkers';
import {Machine, NewMachine, NoIdMachine} from '../../graphql-types/machine-ms';
import {
  GraphQLError,
  MachineMsService,
  MachineMsServiceBindings,
} from '../../services';

@resolver()
export class MachineResolver {
  constructor(
    @inject(MachineMsServiceBindings.SERVICE)
    protected machineMs: MachineMsService,
    @inject(GraphQLBindings.RESOLVER_DATA)
    protected resolverData: ResolverData<MSContextType>,
  ) {}

  @mutation(() => Machine)
  @authorized()
  async createMachine(
    @arg('machine') newMachine: NewMachine,
  ): Promise<Machine> {
    const {currentUser} = this.resolverData.context;
    const machine: NoIdMachine = {
      ...newMachine,
      accountId: currentUser[securityId],
    };

    return this.machineMs.createMachine(machine);
  }

  @query(() => Machine)
  @authorized()
  async getMachineById(@arg('id') id: string): Promise<Machine> {
    const {currentUser} = this.resolverData.context;
    const machine = await this.machineMs.findMachineById(id);
    if (machine.accountId !== currentUser[securityId])
      throw new GraphQLError(
        'The requested machine does not belong to the account',
        403,
      );

    return machine;
  }
}
