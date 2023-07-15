import {field, inputType} from '@loopback/graphql';

@inputType({description: 'Object to create a new user account'})
export class NewAccount {
  @field(() => String)
  email: string;

  @field(() => String)
  username: string;

  @field(() => String)
  password: string;
}
