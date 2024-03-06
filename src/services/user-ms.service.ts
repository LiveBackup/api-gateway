import {BindingKey, BindingScope, inject, injectable} from '@loopback/core';
import {Request} from '@loopback/rest';
import {securityId} from '@loopback/security';
import {IHttpAdapter} from '../adapters/http-adapters';
import {ExtendedUserProfile} from '../checkers';
import {
  Account,
  Credentials,
  Email,
  NewAccount,
  Password,
  Token,
} from '../graphql-types';
import {GraphQLError} from './abstract-ms.service';

export namespace UserMsServiceBindings {
  export const SERVICE = BindingKey.create<UserMsService>(
    'services.UserMsService',
  );
  export const HTTP_ADAPTER = BindingKey.create<IHttpAdapter>(
    'services.UserMsService.http-adapter',
  );
}

@injectable({scope: BindingScope.TRANSIENT})
export class UserMsService {
  constructor(
    @inject(UserMsServiceBindings.HTTP_ADAPTER)
    private readonly client: IHttpAdapter,
  ) {}

  setJwtTokenFromRequest(request: Request): void {
    const authorizationHeaderValue = request.headers.authorization;
    if (!authorizationHeaderValue)
      throw new GraphQLError('No authorization header was provided', 401);

    this.client.setToken(authorizationHeaderValue.split(' ')[1]);
  }

  convertToUserProfile(account: Account): ExtendedUserProfile {
    return {
      [securityId]: account.id,
      username: account.username,
      email: account.email,
    };
  }

  async signUp(newAccount: NewAccount): Promise<Account> {
    const response = await this.client.post<Account>(
      '/auth/sign-up',
      newAccount,
    );
    return response.data;
  }

  async login(credentials: Credentials): Promise<Token> {
    const response = await this.client.post<Token>('/auth/login', credentials);
    return response.data;
  }

  async whoAmI(): Promise<Account> {
    const response = await this.client.get<Account>('/auth/who-am-i');
    return response.data;
  }

  async requestEmailVerification(): Promise<Account> {
    const path = '/account/request-email-verification';
    const response = await this.client.post<Account>(path);
    return response.data;
  }

  async verifyEmail(): Promise<Account> {
    const path = '/account/verify-email';
    const response = await this.client.patch<Account>(path);
    return response.data;
  }

  async requestPasswordRecovery(email: Email): Promise<void> {
    const path = '/credentials/request-password-recovery';
    await this.client.post<void>(path, email);
  }

  async updatePassword(password: Password): Promise<void> {
    const path = '/credentials/update-password';
    await this.client.patch<void>(path, password);
  }
}
