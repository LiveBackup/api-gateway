import {GraphQLBody} from '..';

export const parseSignUp = (data: object): GraphQLBody => {
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

export const parseLogin = (data: object): GraphQLBody => {
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
      credentials: data,
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
