import {GraphQLBody, ParseGraphQL} from '..';

export const parseRequestEmailVerification: ParseGraphQL = (_): GraphQLBody => {
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
