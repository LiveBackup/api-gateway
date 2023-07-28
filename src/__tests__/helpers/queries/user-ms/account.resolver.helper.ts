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

export const parseVerifyEmail = (): GraphQLBody => {
  return {
    operationName: 'VerifyEmail',
    query: `
      mutation VerifyEmail {
        verifyEmail {
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
