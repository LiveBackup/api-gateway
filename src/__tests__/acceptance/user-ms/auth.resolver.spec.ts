import {Client, expect} from '@loopback/testlab';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import sinon from 'sinon';
import {ApiGateway} from '../../../application';
import {MsHttpError} from '../../../services/abstract-ms.service';
import {
  givenClient,
  givenRunningApp,
  queryGraphQL,
} from '../../helpers/app.helper';
import {parseSignUp} from '../../helpers/queries';
import {givenAccount, givenNewAccount} from '../../helpers/types';

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
      const responseData = response.body.data;
      expect(response.body.errors).to.be.Undefined();
      expect(responseData.signUp.id).to.be.equal(expectedAccount.id);
      expect(responseData.signUp.username).to.be.equal(
        expectedAccount.username,
      );
      expect(responseData.signUp.email).to.be.equal(expectedAccount.email);
      expect(responseData.signUp.isEmailVerified).to.be.equal(
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
});
