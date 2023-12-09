import {securityId} from '@loopback/security';
import {expect, stubExpressContext} from '@loopback/testlab';
import sinon from 'sinon';
import {GraphQLError, UserMsService} from '../../../services';
import {MsAuthenticationStrategy} from '../../../strategies';
import {givenAccount} from '../../helpers/types';

describe('Unit - MsAuthenticationStrategy', () => {
  // Sandbox
  const sandbox = sinon.createSandbox();
  // Services
  let userMsService: UserMsService;
  // Straregy
  let msAuthenticationStrategy: MsAuthenticationStrategy;
  // Mock request
  const mockRequest = stubExpressContext().request;

  beforeEach(() => {
    userMsService = new UserMsService('');
    msAuthenticationStrategy = new MsAuthenticationStrategy(userMsService);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Receives a valid request and returns a valid UserProfile', async () => {
    const mockAccount = givenAccount();

    // Stub the userMs.parseJwt method
    sandbox.stub(userMsService, 'setJwtTokenFromRequest').returns();

    // Stub the WhoAmI call
    sandbox.stub(userMsService, 'whoAmI').returns(Promise.resolve(mockAccount));

    // Execute the authentication method
    const userProfile = await msAuthenticationStrategy.authenticate(
      mockRequest,
    );

    expect(userProfile).not.to.be.Undefined();
    expect(userProfile?.[securityId]).to.be.equal(mockAccount.id);
    expect(userProfile?.username).to.be.equal(mockAccount.username);
    expect(userProfile?.email).to.be.equal(mockAccount.email);
  });

  it('Rejects when no Token is provided', async () => {
    const expectedError = new GraphQLError('No token provided', 401);

    // Stub the parseJwt method
    const parseJwtStub = sandbox
      .stub(userMsService, 'setJwtTokenFromRequest')
      .throws(expectedError);

    // Create and spy on the whoAmI method
    const whoAmISpy = sandbox.spy(userMsService, 'whoAmI');

    // Test the authentication method
    let actualError: GraphQLError | undefined = undefined;
    try {
      await msAuthenticationStrategy.authenticate(mockRequest);
    } catch (err) {
      actualError = err;
    }
    // Check the given error details
    expect(actualError).not.to.be.Undefined();
    expect(actualError?.message).to.be.equal(expectedError.message);
    expect(actualError?.statusCode).to.be.equal(expectedError.statusCode);
    // Check the stub and spy calls
    expect(parseJwtStub.calledOnce).to.be.True();
    expect(whoAmISpy.calledOnce).not.to.be.True();
  });

  it('Rejects with error codes in Ms call', async () => {
    const msExpectedErrors = [
      new GraphQLError('Invalid token', 401),
      new GraphQLError('Wrong permissions', 403),
      new GraphQLError('Account not found', 404),
      new GraphQLError('Internal server error', 500),
    ];

    for (const expectedError of msExpectedErrors) {
      // Reset the sandbox
      sandbox.restore();

      // Create the parseJwt stub
      sandbox.stub(userMsService, 'setJwtTokenFromRequest').returns();

      // Create the MsStub returning the error
      sandbox.stub(userMsService, 'whoAmI').throws(expectedError);

      // Execute the authentication method
      let actualError: GraphQLError | undefined = undefined;
      try {
        await msAuthenticationStrategy.authenticate(mockRequest);
      } catch (err) {
        actualError = err;
      }
      // Check the given error details
      expect(actualError).not.to.be.Undefined();
      expect(actualError?.message).to.be.equal(expectedError.message);
      expect(actualError?.statusCode).to.be.equal(expectedError.statusCode);
    }
  });
});
