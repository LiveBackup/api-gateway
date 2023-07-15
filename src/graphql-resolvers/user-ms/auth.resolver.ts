import {inject} from '@loopback/core';
import {arg, mutation, query, resolver} from '@loopback/graphql';
import {Account, NewAccount} from '../../graphql-types';
import {UserMsService, UserMsServiceBindings} from '../../services';

@resolver(() => Account)
export class AccountResolver {
  constructor(
    @inject(UserMsServiceBindings.SERVICE)
    protected userMs: UserMsService,
  ) { }

  @mutation(() => Account)
  async signUp(
    @arg('newAccount') newAccount: NewAccount,
  ): Promise<Account> {
    const account = await this.userMs.signUp(newAccount);
    return account;
  }

  @query(() => Account)
  async whoAmI(@arg('id') id: string): Promise<Account> {
    return new Account();
  }
}
