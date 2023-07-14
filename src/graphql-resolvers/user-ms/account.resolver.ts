import {arg, mutation, resolver} from '@loopback/graphql';
import {Account, NewAccount} from '../../graphql-types';

@resolver(() => Account)
export class AccountResolver {
  @mutation(() => Account)
  async createAccount(
    @arg('newAccount') newAccount: NewAccount,
  ): Promise<Account> {
    return new Account();
  }
}
