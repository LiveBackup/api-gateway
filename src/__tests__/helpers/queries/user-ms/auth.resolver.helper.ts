import {GraphQLBody, ParseGraphQL} from '..';

export const parseSignUp: ParseGraphQL = (data: object): GraphQLBody => {
  return {
    operationName: 'SignUp',
    query: `
      mutation SignUp($newAccount: NewAccount!) {
        signUp(newAccount: $newAccount) {
          id
          email
          isEmailVerified
          registeredAt
          username
        }
      }
    `,
    variables: {
      newAccount: data,
    },
  };
};
