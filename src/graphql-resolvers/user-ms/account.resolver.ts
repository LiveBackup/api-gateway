import {inject} from '@loopback/core';
import {mutation, resolver} from '@loopback/graphql';
import {Request, RestBindings} from '@loopback/rest';
import {Account} from '../../graphql-types';
import {UserMsService, UserMsServiceBindings} from '../../services';

@resolver(() => Account)
export class AccountResolver {
  constructor(
    @inject(RestBindings.Http.REQUEST)
    protected request: Request,
    @inject(UserMsServiceBindings.SERVICE)
    protected userMs: UserMsService,
  ) {}

  @mutation(() => Account)
  async requestEmailVerification(): Promise<Account> {
    this.userMs.setJwtTokenFromRequest(this.request);
    const account = await this.userMs.requestEmailVerification();
    return account;
  }
}
