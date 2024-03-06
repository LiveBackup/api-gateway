import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  GraphQLBindings,
  GraphQLComponent,
  ResolverData,
} from '@loopback/graphql';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {AxiosAdapter} from './adapters/http-adapters';
import {MSContextType, MsAuthChecker} from './checkers';
import {MySequence} from './sequence';
import {
  MachineMsServiceBindings,
  UserMsService,
  UserMsServiceBindings,
} from './services';

export {ApplicationConfig};

export class ApiGateway extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Register the custom authentication strategy
    this.bind(GraphQLBindings.GRAPHQL_AUTH_CHECKER).to(
      async (resolverData: ResolverData<{}>, roles: string[]) => {
        const userMsUrl = await this.get(UserMsServiceBindings.HTTP_ADAPTER);
        const msChecker = new MsAuthChecker(new UserMsService(userMsUrl));
        return msChecker.authenticate(
          resolverData as ResolverData<MSContextType>,
          roles,
        );
      },
    );

    // Set up the custom sequence
    this.sequence(MySequence);

    // Configure GraphQL
    this.component(GraphQLComponent);
    this.configure(GraphQLBindings.GRAPHQL_SERVER).to({asMiddlewareOnly: true});
    const server = this.getSync(GraphQLBindings.GRAPHQL_SERVER);
    this.expressMiddleware('middleware.express.GraphQL', server.expressApp);

    // Set project root
    this.projectRoot = __dirname;
    // Set up default home page
    this.static('/', path.join(this.projectRoot, '../public'));

    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      graphqlResolvers: {
        // Customize ControllerBooter Conventions here
        dirs: ['graphql-resolvers'],
        extensions: ['.resolver.js'],
        nested: true,
      },
    };

    // ############ ADDITIONAL BINDINGS ############
    // UserMs Bindings
    this.bind(UserMsServiceBindings.HTTP_ADAPTER).to(
      new AxiosAdapter(process.env.USER_MS_URL ?? ''),
    );
    // MachineMs Bindings
    this.bind(MachineMsServiceBindings.HTTP_ADAPTER).to(
      new AxiosAdapter(process.env.MACHINE_MS_URL ?? ''),
    );
  }
}
