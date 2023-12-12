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
import {MachineMsService, MachineMsServiceBindings} from '../../services';

@resolver()
export class MachineResolver {
  constructor(
    @inject(MachineMsServiceBindings.SERVICE)
    protected machineMs: MachineMsService,
    @inject(GraphQLBindings.RESOLVER_DATA)
    protected resolverData: ResolverData<MSContextType>,
  ) { }

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
  async getMachineById(@arg('id') id: string): Promise<Machine> {
    return this.machineMs.findMachineById(id);
  }
}
