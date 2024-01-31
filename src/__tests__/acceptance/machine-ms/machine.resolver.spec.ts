import {Client, expect} from '@loopback/testlab';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {ApiGateway} from '../../../application';
import {Machine, NewMachine} from '../../../graphql-types/machine-ms';
import {
  givenClient,
  givenRunningApp,
  queryGraphQL,
} from '../../helpers/app.helper';
import {
  parseCreateMachine,
  parseGetMachineById,
} from '../../helpers/queries/machine-ms';
import {givenAccount, givenMachine} from '../../helpers/types';

describe('e2e - Machine Resolver', () => {
  // Axios Mocks
  let axiosMock: MockAdapter;
  // And and client utilities for testing
  let app: ApiGateway;
  let client: Client;

  before(async () => {
    axiosMock = new MockAdapter(axios);
    app = await givenRunningApp();
    client = await givenClient(app);
  });

  after(async () => {
    await app.stop();
  });

  afterEach(() => {
    axiosMock.reset();
  });

  describe('CreateMachine resolver', () => {
    it('Creates a new machine', async () => {
      // Create the input
      const newMachine: NewMachine = {name: 'New machine'};
      // Create the mocks
      const mockAccount = givenAccount();
      const expectedMachine = givenMachine({
        name: newMachine.name,
        accountId: mockAccount.id,
      });
      const token = 'token123';

      // Mock the UserMS response
      axiosMock.onGet('/auth/who-am-i').reply(200, JSON.stringify(mockAccount));
      // Mock the MachineMS response
      axiosMock.onPost('/machine').reply(201, JSON.stringify(expectedMachine));

      // Query the GraphQL Server
      const requestData = parseCreateMachine(newMachine);
      const response = await queryGraphQL(client, requestData, token);

      // Check the response
      expect(response.statusCode).to.be.equal(200);
      const responseBody = response.body;
      // Check there are no errors
      expect(responseBody.errors).to.be.undefined();
      // Verify the response
      const responseData = responseBody.data.createMachine as Machine;
      expect(responseData.id).to.be.equal(expectedMachine.id);
      expect(responseData.name).to.be.equal(newMachine.name);
      expect(responseData.accountId).to.be.equal(mockAccount.id);
    });

    it('Fails in the checker verification', async () => {
      // Create the input
      const newMachine: NewMachine = {name: 'New machine'};
      // Create the mocks
      const token = 'token123';

      // Mock the UserMS response
      axiosMock.onGet('/auth/who-am-i').reply(401);

      // Query the GraphQL Server
      const requestData = parseCreateMachine(newMachine);
      const response = await queryGraphQL(client, requestData, token);

      // Check the response
      expect(response.statusCode).to.be.equal(200);
      const responseBody = response.body;
      // Verify there is an error
      expect(responseBody.errors).not.to.be.undefined();
    });
  });

  describe('GetMachineById resolver', () => {
    it('Gets a machine', async () => {
      // Create the mocks
      const mockAccount = givenAccount();
      const expectedMachine = givenMachine({accountId: mockAccount.id});
      const token = 'token123';

      // Mock the UserMS response
      axiosMock.onGet('/auth/who-am-i').reply(200, JSON.stringify(mockAccount));
      // Mock the MachineMS response
      axiosMock
        .onGet(`/machine/${expectedMachine.id}`)
        .reply(200, JSON.stringify(expectedMachine));

      // Query the GraphQL Server
      const requestData = parseGetMachineById(expectedMachine.id);
      const response = await queryGraphQL(client, requestData, token);

      // Check the response
      expect(response.statusCode).to.be.equal(200);
      const responseBody = response.body;
      // Check there are no errors
      expect(responseBody.errors).to.be.undefined();
      // Verify the response
      const responseData = responseBody.data.getMachineById as Machine;
      expect(responseData.id).to.be.equal(expectedMachine.id);
      expect(responseData.name).to.be.equal(expectedMachine.name);
      expect(responseData.accountId).to.be.equal(mockAccount.id);
    });

    it('Fails to get the machine since the account is not the owner', async () => {
      // Create the mocks
      const mockAccount = givenAccount();
      const expectedMachine = givenMachine({accountId: 'some_other_id'});
      const token = 'token123';

      // Mock the UserMS response
      axiosMock.onGet('/auth/who-am-i').reply(200, JSON.stringify(mockAccount));
      // Mock the MachineMS response
      axiosMock
        .onGet(`/machine/${expectedMachine.id}`)
        .reply(200, JSON.stringify(expectedMachine));

      // Query the GraphQL Server
      const requestData = parseGetMachineById(expectedMachine.id);
      const response = await queryGraphQL(client, requestData, token);

      // Check the response
      expect(response.statusCode).to.be.equal(200);
      const responseBody = response.body;
      // Verify there is an error
      expect(responseBody.errors).not.to.be.undefined();
      expect(
        responseBody.errors[0].extensions.exception.statusCode,
      ).to.be.equal(403);
    });
  });
});
