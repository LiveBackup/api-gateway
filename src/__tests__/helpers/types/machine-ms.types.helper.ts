import {Machine} from '../../../graphql-types/machine-ms';

export const givenMachine = (data: Partial<Machine>): Machine => {
  return Object.assign(
    {
      id: '1',
      name: 'MachineName',
      accountId: 'account-id',
    },
    data,
  ) as Machine;
};
