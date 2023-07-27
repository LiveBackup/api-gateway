import {inject} from '@loopback/core';
import {arg, mutation, resolver} from '@loopback/graphql';
import {Request, RestBindings} from '@loopback/rest';
import {Email} from '../../graphql-types';
import {UserMsService, UserMsServiceBindings} from '../../services';

@resolver()
export class CredentialsResolver {
  constructor(
    @inject(RestBindings.Http.REQUEST)
    protected request: Request,
    @inject(UserMsServiceBindings.SERVICE)
    protected userMs: UserMsService,
  ) {}

  @mutation(() => Boolean)
  async requestPasswordRecovery(@arg('email') email: Email): Promise<boolean> {
    await this.userMs.requestPasswordRecovery(email);
    return true;
  }
}
