import {BindingKey, BindingScope, inject, injectable} from '@loopback/core';
import {Machine, NoIdMachine} from '../graphql-types/machine-ms';
import {AbstractMsService} from './abstract-ms.service';

export namespace MachineMsServiceBindings {
  export const SERVICE = BindingKey.create<MachineMsService>(
    'services.MachineMsService',
  );
  export const MS_URL = BindingKey.create<string>(
    'services.MachineMsService.url',
  );
}

@injectable({scope: BindingScope.TRANSIENT})
export class MachineMsService extends AbstractMsService {
  constructor(
    @inject(MachineMsServiceBindings.MS_URL)
    msUrl: string,
  ) {
    super(msUrl);
  }

  async createMachine(newMachine: NoIdMachine): Promise<Machine> {
    const response = await this.client.post('/machine', newMachine);
    return this.handleResponse<Machine>(response);
  }

  async findMachineById(id: string): Promise<Machine> {
    const response = await this.client.get(`/machine/${id}`);
    return this.handleResponse<Machine>(response);
  }

  async findMachinesByAccountId(accountId: string): Promise<Machine[]> {
    const response = await this.client.get(`/account/${accountId}/machines`);
    return this.handleResponse<Machine[]>(response);
  }

  async updateMachineById(id: string, newInfo: NoIdMachine): Promise<Machine> {
    const response = await this.client.put(`/machine/${id}`, newInfo);
    return this.handleResponse<Machine>(response);
  }

  async deleteMachineById(id: string): Promise<Machine> {
    const response = await this.client.delete(`/machine/${id}`);
    return this.handleResponse<Machine>(response);
  }
}
