import {field, inputType} from '@loopback/graphql';

@inputType({description: 'Login request object'})
export class Credentials {
  @field(() => String)
  username: string;

  @field(() => String)
  password: string;
}
