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

export const parseUpdatePassword = (data: object): GraphQLBody => {
  return {
    operationName: 'UpdatePassword',
    query: `
      mutation UpdatePassword($password: Password!) {
        updatePassword(password: $password)
      }
    `,
    variables: {
      password: data,
    },
  };
};
