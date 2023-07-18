import {BindingKey, inject} from '@loopback/core';
import {Account, Credentials, NewAccount, Token} from '../graphql-types';
import {AbstractMsService} from './abstract-ms.service';

export namespace UserMsServiceBindings {
  export const SERVICE = BindingKey.create<UserMsService>(
    'services.UserMsService',
  );
  export const MS_URL = BindingKey.create<string>('services.UserMsService.url');
}

export class UserMsService extends AbstractMsService {
  constructor(
    @inject(UserMsServiceBindings.MS_URL)
    url: string,
  ) {
    super(url);
  }

  async signUp(newAccount: NewAccount): Promise<Account> {
    const response = await this.client.post('/auth/sign-up', newAccount);
    return this.handleResponse<Account>(response);
  }

  async login(credentials: Credentials): Promise<Token> {
    const response = await this.client.post('/auth/login', credentials);
    return this.handleResponse<Token>(response);
  }
}
