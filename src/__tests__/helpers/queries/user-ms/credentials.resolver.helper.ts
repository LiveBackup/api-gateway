import {GraphQLBody} from '..';

export const parseRequestPasswordRecovery = (data: object): GraphQLBody => {
  return {
    operationName: 'RequestPasswordRecovery',
    query: `
      mutation RequestPasswordRecovery($email: Email!) {
        requestPasswordRecovery(email: $email)
      }
    `,
    variables: {
      email: data,
    },
  };
};
