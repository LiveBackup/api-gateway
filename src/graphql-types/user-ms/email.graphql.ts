import {field, inputType} from '@loopback/graphql';

@inputType({description: 'Password recovery request object'})
export class Email {
  @field(() => String)
  email: string;
}
