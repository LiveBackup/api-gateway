import {GraphQLBody} from '..';
import {Credentials, NewAccount} from '../../../../graphql-types';

export const parseSignUp = (newAccount: NewAccount): GraphQLBody => {
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
      newAccount,
    },
  };
};

export const parseLogin = (credentials: Credentials): GraphQLBody => {
  return {
    operationName: 'Login',
    query: `
      mutation Login($credentials: Credentials!) {
        login(credentials: $credentials) {
          token
        }
      }
    `,
    variables: {
      credentials,
    },
  };
};

export const parseWhoAmI = (): GraphQLBody => {
  return {
    operationName: 'WhoAmI',
    query: `
      query WhoAmI {
        whoAmI {
          id
          email
          isEmailVerified
          registeredAt
          username
        }
      }
    `,
  };
};
