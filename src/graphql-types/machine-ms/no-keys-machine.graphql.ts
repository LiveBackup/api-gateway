import {field, inputType} from '@loopback/graphql';

@inputType({description: 'Input machine with neither foreign nor primary keys'})
export class NoKeysMachine {
  @field(() => String)
  name: string;
}
