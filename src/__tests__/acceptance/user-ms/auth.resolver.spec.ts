import {Client, expect} from '@loopback/testlab';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import sinon from 'sinon';
import {ApiGateway} from '../../../application';
import {Account, Token} from '../../../graphql-types';
import {MsHttpError} from '../../../services/abstract-ms.service';
import {
  givenClient,
  givenRunningApp,
  queryGraphQL,
} from '../../helpers/app.helper';
import {parseLogin, parseSignUp, parseWhoAmI} from '../../helpers/queries';
import {
  givenAccount,
  givenCredentials,
  givenNewAccount,
  givenToken,
} from '../../helpers/types';

describe('e2e - Auth Resolver', () => {
  // Sinon sandbox
  const sandbox = sinon.createSandbox();
  // Axios Mocks
  let userMsMock: MockAdapter;
  // And and client utilities for testing
  let app: ApiGateway;
  let client: Client;

  before(async () => {
    app = await givenRunningApp();
    client = await givenClient(app);
  });

  beforeEach(() => {
    userMsMock = new MockAdapter(axios);
  });

  after(async () => {
    await app.stop();
  });

  afterEach(async () => {
    sandbox.restore();
    userMsMock.reset();
  });

  describe('Signup resolver', () => {
    it('Registers a new account', async () => {
      // Create the mocks
      const newAccount = givenNewAccount();
      const expectedAccount = givenAccount();

      // Mock the Post method on Axios to return the expectedAccount
      userMsMock.onPost().reply(201, JSON.stringify(expectedAccount));

      // Query the graphql server
      const requestData = parseSignUp(newAccount);
      const response = await queryGraphQL(client, requestData);

      // Compare the expected behavior
      expect(response.statusCode).to.be.equal(200);
      const responseBody = response.body;
      expect(response.body.errors).to.be.Undefined();
      const responseData = responseBody.data.signUp as Account;
      expect(responseData.id).to.be.equal(expectedAccount.id);
      expect(responseData.username).to.be.equal(expectedAccount.username);
      expect(responseData.email).to.be.equal(expectedAccount.email);
      expect(responseData.isEmailVerified).to.be.equal(
        expectedAccount.isEmailVerified,
      );
    });

    it('Fails to register an account', async () => {
      // Create the mocks
      const newAccount = givenNewAccount();
      const expectedError: MsHttpError = {
        error: {
          message: 'There already exists an account with the given email',
          statusCode: 400,
        },
      };

      // Mock the Post method on Axios to return the expectedAccount
      userMsMock.onPost().reply(400, JSON.stringify(expectedError));

      // Query the graphql server
      const requestData = parseSignUp(newAccount);
      const response = await queryGraphQL(client, requestData);
      // Compare the expected behavior
      expect(response.statusCode).to.be.equal(200);
      const responseBody = response.body;
      expect(responseBody.errors).not.to.be.Undefined();
      const error = responseBody.errors[0];
      expect(error.message).to.be.equal(expectedError.error.message);
    });
  });

  describe('Login resolver', () => {
    it('Gets a valid token', async () => {
      // Create the mock objects
      const credentials = givenCredentials();
      const expectedToken = givenToken();

      // Mock the post method on Axios
      userMsMock
        .onPost('/auth/login')
        .reply(200, JSON.stringify(expectedToken));

      // Query the graphql server
      const requestData = parseLogin(credentials);
      const response = await queryGraphQL(client, requestData);

      // Compare the expected behavior
      expect(response.statusCode).to.be.equal(200);
      const responseBody = response.body;
      expect(responseBody.erros).to.be.Undefined();
      const responseData = responseBody.data.login as Token;
      expect(responseData.token).to.be.equal(expectedToken.token);
    });

    it('Fails to get a valid token', async () => {
      // Create the mocks
      const credentials = givenCredentials();
      const expectedError: MsHttpError = {
        error: {
          message: 'There already exists an account with the given email',
          statusCode: 400,
        },
      };

      // Mock the Post method on Axios to return the expectedAccount
      userMsMock.onPost().reply(400, JSON.stringify(expectedError));

      // Query the graphql server
      const requestData = parseLogin(credentials);
      const response = await queryGraphQL(client, requestData);

      // Compare the expected behavior
      expect(response.statusCode).to.be.equal(200);
      const responseBody = response.body;
      expect(responseBody.errors).not.to.be.Undefined();
      const error = responseBody.errors[0];
      expect(error.message).to.be.equal(expectedError.error.message);
    });
  });

  describe('WhoAmI resolver', () => {
    it('Gets a valid account when providing a valid token', async () => {
      // Mocks object
      const expectedAccount = givenAccount();
      const token = 'token123';

      // Mock the axios call
      userMsMock
        .onGet('/auth/who-am-i')
        .reply(200, JSON.stringify(expectedAccount));

      // Query the GraphQL Server
      const requestData = parseWhoAmI({});
      const response = await queryGraphQL(client, requestData, token);

      // Check the response
      expect(response.statusCode).to.be.equal(200);
      const responseBody = response.body;
      expect(response.body.errors).to.be.undefined();
      const responseData = responseBody.data.whoAmI as Account;
      expect(responseData.id).to.be.equal(expectedAccount.id);
      expect(responseData.email).to.be.equal(expectedAccount.email);
      expect(responseData.username).to.be.equal(expectedAccount.username);
    });

    it('Fails to get an account when invalid token is provided', async () => {
      // Create the mocks
      const token = 'token1234';
      const expectedError: MsHttpError = {
        error: {
          message: 'Invalid token',
          statusCode: 401,
        },
      };

      // Mock the Post method on Axios to return the expectedAccount
      userMsMock
        .onGet('/auth/who-am-i')
        .reply(401, JSON.stringify(expectedError));

      // Query the graphql server
      const requestData = parseWhoAmI({});
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
      const requestData = parseWhoAmI({});
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
