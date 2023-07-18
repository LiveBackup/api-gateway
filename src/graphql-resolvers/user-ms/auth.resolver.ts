import {inject} from '@loopback/core';
import {arg, mutation, query, resolver} from '@loopback/graphql';
import {Account, Credentials, NewAccount, Token} from '../../graphql-types';
import {UserMsService, UserMsServiceBindings} from '../../services';

@resolver(() => Account)
export class AccountResolver {
  constructor(
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
  async whoAmI(@arg('id') id: string): Promise<Account> {
    return new Account();
  }
}
