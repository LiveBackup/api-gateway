import {GraphQLBody} from '..';
import {Email, Password} from '../../../../graphql-types';

export const parseRequestPasswordRecovery = (email: Email): GraphQLBody => {
  return {
    operationName: 'RequestPasswordRecovery',
    query: `
      mutation RequestPasswordRecovery($email: Email!) {
        requestPasswordRecovery(email: $email)
      }
    `,
    variables: {
      email,
    },
  };
};

export const parseUpdatePassword = (password: Password): GraphQLBody => {
  return {
    operationName: 'UpdatePassword',
    query: `
      mutation UpdatePassword($password: Password!) {
        updatePassword(password: $password)
      }
    `,
    variables: {
      password,
    },
  };
};
