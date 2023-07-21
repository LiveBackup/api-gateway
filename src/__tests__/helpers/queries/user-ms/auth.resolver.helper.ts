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

export const parseLogin: ParseGraphQL = (data: object): GraphQLBody => {
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

export const parseWhoAmI: ParseGraphQL = (_): GraphQLBody => {
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
