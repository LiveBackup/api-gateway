import {Client, expect} from '@loopback/testlab';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import sinon from 'sinon';
import {ApiGateway} from '../../../application';
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
    it('Register a new account', async () => {
      const newAccount = givenNewAccount();
      const expectedAccount = givenAccount();

      userMsMock.onPost().reply(201, JSON.stringify(expectedAccount));

      const requestData = parseSignUp(newAccount);
      const response = await queryGraphQL(client, requestData);

      expect(response.statusCode).to.be.equal(200);
      const responseData = response.body.data;
      expect(responseData.error).to.be.Undefined();
      expect(responseData.signUp.id).to.be.equal(expectedAccount.id);
      expect(responseData.signUp.username).to.be.equal(
        expectedAccount.username,
      );
      expect(responseData.signUp.email).to.be.equal(expectedAccount.email);
      expect(responseData.signUp.isEmailVerified).to.be.equal(
        expectedAccount.isEmailVerified,
      );
    });
  });
});
