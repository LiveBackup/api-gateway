import {BindingKey, BindingScope, inject, injectable} from '@loopback/core';
import {IHttpAdapter} from '../adapters/http-adapters';
import {Machine, NewMachine, NoIdMachine} from '../graphql-types/machine-ms';

export namespace MachineMsServiceBindings {
  export const SERVICE = BindingKey.create<MachineMsService>(
    'services.MachineMsService',
  );
  export const HTTP_ADAPTER = BindingKey.create<IHttpAdapter>(
    'services.MachineMsService.http-adapter',
  );
}

@injectable({scope: BindingScope.TRANSIENT})
export class MachineMsService {
  constructor(
    @inject(MachineMsServiceBindings.HTTP_ADAPTER)
    private readonly client: IHttpAdapter,
  ) {}

  async createMachine(newMachine: NoIdMachine): Promise<Machine> {
    const response = await this.client.post<Machine>('/machine', newMachine);
    return response.data;
  }

  async findMachineById(id: string): Promise<Machine> {
    const response = await this.client.get<Machine>(`/machine/${id}`);
    return response.data;
  }

  async findMachinesByAccountId(accountId: string): Promise<Machine[]> {
    const response = await this.client.get<Machine[]>(
      `/account/${accountId}/machines`,
    );
    return response.data;
  }

  async updateMachineById(
    id: string,
    newData: Partial<NewMachine>,
  ): Promise<Machine> {
    const response = await this.client.put<Machine>(`/machine/${id}`, newData);
    return response.data;
  }

  async deleteMachineById(id: string): Promise<Machine> {
    const response = await this.client.delete<Machine>(`/machine/${id}`);
    return response.data;
  }
}
