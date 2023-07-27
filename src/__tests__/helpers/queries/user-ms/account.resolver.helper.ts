import {GraphQLBody} from '..';

export const parseRequestEmailVerification = (): GraphQLBody => {
  return {
    operationName: 'RequestEmailVerification',
    query: `
      mutation RequestEmailVerification {
        requestEmailVerification {
          id
          email
          username
          isEmailVerified
          registeredAt
        }
      }
    `,
  };
};
