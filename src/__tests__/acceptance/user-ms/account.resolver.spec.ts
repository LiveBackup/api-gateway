import {Client, expect} from '@loopback/testlab';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {ApiGateway} from '../../../application';
import {Account} from '../../../graphql-types';
import {MsHttpError} from '../../../services/abstract-ms.service';
import {
  givenClient,
  givenRunningApp,
  queryGraphQL,
} from '../../helpers/app.helper';
import {parseRequestEmailVerification} from '../../helpers/queries';
import {givenAccount} from '../../helpers/types';

describe('e2e - Account Resolver', () => {
  // Axios Mocks
  let userMsMock: MockAdapter;
  // And and client utilities for testing
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

  describe('RequestEmailVerification resolver', () => {
    it('Sends a valid request', async () => {
      // Create the mocks
      const token = 'token123';
      const expectedAccount = givenAccount();

      // Mock the Post method on Axios to return the expectedAccount
      userMsMock.onPost().reply(200, JSON.stringify(expectedAccount));

      // Query the graphql server
      const requestData = parseRequestEmailVerification();
      const response = await queryGraphQL(client, requestData, token);

      // Compare the expected behavior
      expect(response.statusCode).to.be.equal(200);
      const responseBody = response.body;
      expect(responseBody.errors).to.be.Undefined();
      const responseData = responseBody.data
        .requestEmailVerification as Account;
      expect(responseData.id).to.be.equal(expectedAccount.id);
      expect(responseData.email).to.be.equal(expectedAccount.email);
      expect(responseData.username).to.be.equal(expectedAccount.username);
    });

    it('Fails when invalid token is provided', async () => {
      // Create the mocks
      const token = 'token123';
      const expectedError: MsHttpError = {
        error: {
          message: 'Invalid token',
          statusCode: 401,
        },
      };

      // Mock the post methond on Axios to return the expected error
      userMsMock.onPost().reply(401, JSON.stringify(expectedError));

      // Query the Graphql server
      const requestData = parseRequestEmailVerification();
      const response = await queryGraphQL(client, requestData, token);

      // Compare the expected behavior
      expect(response.statusCode).to.be.equal(200);
      const responseBody = response.body;
      expect(responseBody.errors).not.to.be.Undefined();
      const error = responseBody.errors[0];
      expect(error.message).to.be.equal(expectedError.error.message);
    });

    it('Fails when no token is provided', async () => {
      // Create the mocks
      const expectedError: MsHttpError = {
        error: {
          message: 'No authorization header was provided',
          statusCode: 401,
        },
      };

      // Query the graphql server
      const requestData = parseRequestEmailVerification();
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
