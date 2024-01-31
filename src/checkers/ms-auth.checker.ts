import {ResolverData} from '@loopback/graphql';
import {Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {UserMsService} from '../services';

export type ExtendedUserProfile = UserProfile & {
  username: string;
};

export type MSContextType = {
  req: Request;
  currentUser: ExtendedUserProfile;
};

export class MsAuthChecker {
  constructor(protected readonly userMsService: UserMsService) {}

  async authenticate(
    resolverData: ResolverData<MSContextType>,
    _: string[],
  ): Promise<boolean> {
    // Get the User profile if it has not been loaded to the context
    this.userMsService.setJwtTokenFromRequest(resolverData.context.req);
    const account = await this.userMsService.whoAmI();
    const userProfile = this.userMsService.convertToUserProfile(account);
    resolverData.context.currentUser = userProfile;

    return true;
  }
}
