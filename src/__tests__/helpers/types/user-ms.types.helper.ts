import {Account, NewAccount} from '../../../graphql-types';

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
