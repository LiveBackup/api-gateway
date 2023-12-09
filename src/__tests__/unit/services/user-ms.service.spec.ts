import {expect, stubExpressContext} from '@loopback/testlab';
import sinon from 'sinon';
import {GraphQLError, UserMsService} from '../../../services';

describe('Unit - UserMs service', () => {
  // Sandbox
  const sandbox = sinon.createSandbox();
  // Services
  const userMs = new UserMsService('');

  afterEach(() => {
    sandbox.restore();
  });

  describe('SetJwtTokenFromRequest method', () => {
    // Mock request
    const request = stubExpressContext().request;

    it('Gets the token from the request headers', () => {
      // Provides a Authorization header value
      request.headers.authorization = 'bearer: token123';
      // Create an spy fro split function in authorization header
      const tokenSplitSpy = sandbox.spy(String.prototype, 'split');
      // Execute the method
      userMs.setJwtTokenFromRequest(request);

      expect(tokenSplitSpy.calledOnce).to.be.True();
      expect(tokenSplitSpy.getCalls()[0].returnValue).to.be.deepEqual([
        'bearer:',
        'token123',
      ]);
    });

    it('Throws an error when the token is not provided', () => {
      // Provides a Authorization header value
      request.headers.authorization = undefined;
      // Execute the method
      let error: GraphQLError | undefined = undefined;
      try {
        userMs.setJwtTokenFromRequest(request);
      } catch (err) {
        error = err;
      }

      expect(error).not.to.be.Undefined();
      expect(error?.message).to.be.equal(
        'No authorization header was provided',
      );
      expect(error?.statusCode).to.be.equal(401);
    });
  });
});
