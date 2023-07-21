import {Client, createRestAppClient, supertest} from '@loopback/testlab';
import {ApiGateway} from '../../application';
import {GraphQLBody} from './queries';

export const givenRunningApp = async function (): Promise<ApiGateway> {
  const app = new ApiGateway({rest: {port: 4000}});
  await app.boot();
  await app.start();

  return app;
};

export const givenClient = async function (app: ApiGateway): Promise<Client> {
  return createRestAppClient(app);
};

export const queryGraphQL = function (
  client: Client,
  data: GraphQLBody,
  token?: string,
): supertest.Test {
  let test = client
    .post('/graphql')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');

  if (token) test = test.set('Authorization', `Bearer: ${token}`);

  return test.send(data);
};
