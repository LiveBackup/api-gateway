import {field, inputType} from '@loopback/graphql';

@inputType({description: 'Password update object'})
export class Password {
  @field(() => String)
  password: string;
}
