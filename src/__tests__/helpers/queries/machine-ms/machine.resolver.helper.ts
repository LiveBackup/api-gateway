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
    variables: {
      newMachine,
    },
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
    variables: {
      id,
    },
  };
};
