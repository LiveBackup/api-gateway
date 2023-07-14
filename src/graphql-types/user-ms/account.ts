import {ID, field, objectType} from '@loopback/graphql';

@objectType({description: 'Object representing an user account'})
export class Account {
  @field(type => ID)
  id: string;

  @field(type => String)
  username: string;

  @field(type => String)
  email: string;

  @field(type => Boolean)
  isEmailVerified: boolean;

  @field(type => Date)
  registeredAt: Date;
}
