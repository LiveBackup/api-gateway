import {
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  AuthenticationBindings,
  AuthenticationMetadata,
  AuthenticationStrategy,
} from '@loopback/authentication';
import {
  BindingScope,
  Getter,
  Provider,
  extensionPoint,
  extensions,
  inject,
} from '@loopback/core';
import {Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {UserMsService, UserMsServiceBindings} from '../services';

export type ExtendedUserProfile = UserProfile & {
  username: string;
};

export class MsAuthenticationStrategy implements AuthenticationStrategy {
  name = 'ms-auth';

  constructor(
    @inject(UserMsServiceBindings.SERVICE)
    protected userMsService: UserMsService,
  ) {}

  async authenticate(
    request: Request,
  ): Promise<ExtendedUserProfile | undefined> {
    this.userMsService.setJwtTokenFromRequest(request);
    const account = await this.userMsService.whoAmI();
    return this.userMsService.convertToUserProfile(account);
  }
}

@extensionPoint(
  AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME,
  {scope: BindingScope.TRANSIENT},
)
export class MsAuthenticationStrategyProvider
  implements Provider<AuthenticationStrategy>
{
  constructor(
    @extensions()
    private authenticationStrategies: Getter<AuthenticationStrategy[]>,
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata,
  ) {}

  async findAuthenticationStrategy(
    name: string,
  ): Promise<AuthenticationStrategy | undefined> {
    const strategies = await this.authenticationStrategies();
    const matchingAuthStrategy = strategies.find(a => a.name === name);
    return matchingAuthStrategy;
  }

  async value(): Promise<AuthenticationStrategy> {
    const name = this.metadata.strategy;
    const strategy = await this.findAuthenticationStrategy(name);

    if (!strategy) {
      const error = Object.assign(
        new Error(`The strategy ${name} is not available`),
        {
          code: AUTHENTICATION_STRATEGY_NOT_FOUND,
        },
      );
      throw error;
    }
    return strategy;
  }
}
