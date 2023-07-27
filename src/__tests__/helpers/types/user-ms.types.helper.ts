import {
  Account,
  Credentials,
  Email,
  NewAccount,
  Token,
} from '../../../graphql-types';

export const givenNewAccount = (data?: Partial<NewAccount>): NewAccount => {
  return Object.assign(
    {
      username: 'testing',
      email: 'test@email.com',
      password: 'strong_password',
    },
    data,
  ) as NewAccount;
};

export const givenAccount = (data?: Partial<Account>): Account => {
  return Object.assign(
    {
      id: '1',
      username: 'testing',
      email: 'test@email.com',
      isEmailVerified: false,
      registeredAt: new Date(1689548400000),
    },
    data,
  ) as Account;
};

export const givenCredentials = (data?: Partial<Credentials>): Credentials => {
  return Object.assign(
    {
      username: 'testing',
      password: 'strong_password',
    },
    data,
  ) as Credentials;
};

export const givenToken = (data?: Partial<Token>): Token => {
  return Object.assign(
    {
      token: 'token',
    },
    data,
  ) as Token;
};

export const givenEmail = (data?: Partial<Email>): Email => {
  return Object.assign(
    {
      email: 'testing@email.com',
    },
    data,
  ) as Email;
};
