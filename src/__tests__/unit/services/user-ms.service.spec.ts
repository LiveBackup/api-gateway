import {expect, stubExpressContext} from '@loopback/testlab';
import sinon from 'sinon';
import {AxiosAdapter} from '../../../adapters/http-adapters';
import {GraphQLError, UserMsService} from '../../../services';

describe('Unit - UserMs service', () => {
  // Sandbox
  const sandbox = sinon.createSandbox();
  // Services
  const userMs = new UserMsService(new AxiosAdapter(''));

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

      sandbox.assert.calledOnce(tokenSplitSpy);
      expect(tokenSplitSpy.getCalls()[0].returnValue).to.be.deepEqual([
        'bearer:',
        'token123',
      ]);
    });

    it('Throws an error when the token is not provided', () => {
      // Provides a Authorization header value
      request.headers.authorization = undefined;
      // Execute the method
      const setJwtSpy = sandbox.spy(userMs, 'setJwtTokenFromRequest');
      let error: GraphQLError | undefined = undefined;
      try {
        userMs.setJwtTokenFromRequest(request);
      } catch (err) {
        error = err;
      } finally {
        // Check the spy
        sandbox.assert.calledOnce(setJwtSpy);
        sandbox.assert.threw(setJwtSpy);
        const errorMessage = 'No authorization header was provided';
        expect(error).not.to.be.undefined();
        expect(error?.message).to.be.equal(errorMessage);
        expect(error?.statusCode).to.be.equal(401);
      }
    });
  });
});
