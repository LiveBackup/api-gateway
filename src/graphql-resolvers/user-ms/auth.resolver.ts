import {inject} from '@loopback/core';
import {arg, mutation, query, resolver} from '@loopback/graphql';
import {Request, RestBindings} from '@loopback/rest';
import {Account, Credentials, NewAccount, Token} from '../../graphql-types';
import {UserMsService, UserMsServiceBindings} from '../../services';

@resolver(() => Account)
export class AuthResolver {
  constructor(
    @inject(RestBindings.Http.REQUEST)
    protected request: Request,
    @inject(UserMsServiceBindings.SERVICE)
    protected userMs: UserMsService,
  ) {}

  @mutation(() => Account)
  async signUp(@arg('newAccount') newAccount: NewAccount): Promise<Account> {
    const account = await this.userMs.signUp(newAccount);
    return account;
  }

  @mutation(() => Token)
  async login(@arg('credentials') credentials: Credentials): Promise<Token> {
    const token = await this.userMs.login(credentials);
    return token;
  }

  @query(() => Account)
  async whoAmI(): Promise<Account> {
    this.userMs.setJwtTokenFromRequest(this.request);
    const account = this.userMs.whoAmI();
    return account;
  }
}
