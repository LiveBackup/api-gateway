import {Client, expect} from '@loopback/testlab';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {ApiGateway} from '../../../application';
import {MsHttpError} from '../../../services';
import {
  givenClient,
  givenRunningApp,
  queryGraphQL,
} from '../../helpers/app.helper';
import {parseRequestPasswordRecovery} from '../../helpers/queries/user-ms/credentials.resolver.helper';
import {givenEmail} from '../../helpers/types';

describe('e2e - Credentials Resolver', () => {
  // Axios Mocks
  let userMsMock: MockAdapter;
  // App and client utilities for testing
  let app: ApiGateway;
  let client: Client;

  before(async () => {
    userMsMock = new MockAdapter(axios);
    app = await givenRunningApp();
    client = await givenClient(app);
  });

  after(async () => {
    await app.stop();
  });

  afterEach(() => {
    userMsMock.reset();
  });

  describe('RequestPasswordRecovery resolver', () => {
    it('Sends a valid request', async () => {
      // Create the mock objects
      const emailRequest = givenEmail();

      // Mock the axios method
      userMsMock.onPost().reply(204);

      // Query the graphql server
      const requestData = parseRequestPasswordRecovery(emailRequest);
      const response = await queryGraphQL(client, requestData);

      // Compare the expected behavior
      expect(response.statusCode).to.be.equal(200);
      const responseBody = response.body;
      expect(responseBody.errors).to.be.Undefined();
      const responseData = responseBody.data.requestPasswordRecovery as boolean;
      expect(responseData).to.be.True();
    });

    it('Fails to send the request', async () => {
      // Create the mock objects
      const emailRequest = givenEmail();
      const expectedError: MsHttpError = {
        error: {
          message: 'Email not found',
          statusCode: 404,
        },
      };

      // Mock the axios method to respond with an error
      userMsMock.onPost().reply(404, JSON.stringify(expectedError));

      // Query the graphql server
      const requestData = parseRequestPasswordRecovery(emailRequest);
      const response = await queryGraphQL(client, requestData);

      // Compare the expected behavior
      expect(response.statusCode).to.be.equal(200);
      const responseBody = response.body;
      expect(responseBody.errors).not.to.be.Undefined();
      const error = responseBody.errors[0];
      expect(error.message).to.be.equal(expectedError.error.message);
    });
  });
});
