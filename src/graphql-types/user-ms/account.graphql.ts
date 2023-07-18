import {ID, field, objectType} from '@loopback/graphql';

@objectType({description: 'Object representing an user account'})
export class Account {
  @field(() => ID)
  id: string;

  @field(() => String)
  username: string;

  @field(() => String)
  email: string;

  @field(() => Boolean)
  isEmailVerified: boolean;

  @field(() => String)
  registeredAt: string;
}
