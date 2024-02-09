import {GraphQLBody} from '..';
import {NewMachine} from '../../../../graphql-types/machine-ms';

export const parseCreateMachine = (newMachine: NewMachine): GraphQLBody => {
  return {
    operationName: 'CreateMachine',
    query: `
      mutation CreateMachine($newMachine: NewMachine!) {
        createMachine(machine: $newMachine) {
          id,
          name,
          accountId
        }
      }
    `,
    variables: {newMachine},
  };
};

export const parseGetMachineById = (id: string): GraphQLBody => {
  return {
    operationName: 'GetMachineById',
    query: `
      query GetMachineById($id: String!) {
        getMachineById(id: $id) {
          id,
          name,
          accountId
        }
      }
    `,
    variables: {id},
  };
};

export const parseGetAccountMachines = (): GraphQLBody => {
  return {
    operationName: 'GetAccountMachines',
    query: `
      query GetAccountMachines {
        getAccountMachines {
          id,
          name,
          accountId
        }
      }
    `,
  };
};

export const parseUpdateMachine = (
  id: string,
  newData: Partial<NewMachine>,
): GraphQLBody => {
  return {
    operationName: 'UpdateMachine',
    query: `
      mutation UpdateMachine($id: String!, $newData: NewMachine!) {
        updateMachine(id: $id, newData: $newData) {
          id,
          name,
          accountId,
        }
      }
    `,
    variables: {id, newData},
  };
};

export const parseDeleteMachine = (id: string): GraphQLBody => {
  return {
    operationName: 'DeleteMachine',
    query: `
      mutation DeleteMachine($id: String!) {
        deleteMachine(id: $id) {
          id,
          name,
          accountId,
        }
      }
    `,
    variables: {id},
  };
};
