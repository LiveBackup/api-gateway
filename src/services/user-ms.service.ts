import {BindingKey, BindingScope, inject, injectable} from '@loopback/core';
import {Request} from '@loopback/rest';
import {AbstractMsService, GraphQLError} from '.';
import {Account, Credentials, Email, NewAccount, Token} from '../graphql-types';

export namespace UserMsServiceBindings {
  export const SERVICE = BindingKey.create<UserMsService>(
    'services.UserMsService',
  );
  export const MS_URL = BindingKey.create<string>('services.UserMsService.url');
}

@injectable({scope: BindingScope.TRANSIENT})
export class UserMsService extends AbstractMsService {
  protected jwtToken: string | undefined;

  constructor(
    @inject(UserMsServiceBindings.MS_URL)
    msUrl: string,
  ) {
    super(msUrl);
    this.jwtToken = undefined;
    this.client.interceptors.request.use(config => {
      if (this.jwtToken)
        config.headers.Authorization = `Bearer ${this.jwtToken}`;

      return config;
    });
  }

  setJwtTokenFromRequest(request: Request): void {
    const authorizationHeaderValue = request.headers.authorization;
    if (!authorizationHeaderValue)
      throw new GraphQLError('No authorization header was provided', 401);

    this.jwtToken = authorizationHeaderValue.split(' ')[1];
  }

  async signUp(newAccount: NewAccount): Promise<Account> {
    const response = await this.client.post('/auth/sign-up', newAccount);
    return this.handleResponse<Account>(response);
  }

  async login(credentials: Credentials): Promise<Token> {
    const response = await this.client.post('/auth/login', credentials);
    return this.handleResponse<Token>(response);
  }

  async whoAmI(): Promise<Account> {
    const response = await this.client.get('/auth/who-am-i');
    return this.handleResponse<Account>(response);
  }

  async requestEmailVerification(): Promise<Account> {
    const path = '/account/request-email-verification';
    const response = await this.client.post(path);
    return this.handleResponse<Account>(response);
  }

  async verifyEmail(): Promise<Account> {
    const path = '/account/verify-email';
    const response = await this.client.patch(path);
    return this.handleResponse<Account>(response);
  }

  async requestPasswordRecovery(email: Email): Promise<void> {
    const path = '/credentials/request-password-recovery';
    const response = await this.client.post(path, email);
    this.handleResponse<void>(response);
  }
}
