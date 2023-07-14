import {field, inputType} from '@loopback/graphql';

@inputType({description: 'Object to create a new user account'})
export class NewAccount {
  @field(type => String)
  email: string;

  @field(type => String)
  username: string;

  @field(type => String)
  password: string;
}
