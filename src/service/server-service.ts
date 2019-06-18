import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import * as https from 'https';
import * as nodePath from 'path';
import { Container } from '../container';
import { ILogger } from '../interface/logger-interface';
import { AccessMiddleware } from '../middleware/access-middleware';
import { ErrorMiddleware } from '../middleware/error-middleware';
import { NotFoundMiddleware } from '../middleware/not-found-middleware';
import { LoggerService } from './logger-service';

export class ServerService {
    private logger: ILogger;
    private container: Container;
    private router: express.Application;

    private pathToKeyPem: string;
    private pathToCertPem: string;

    private connection: any;

    constructor(container: Container) {
        this.container = container;
        this.logger = new LoggerService(container, 'service', 'server');
        this.router = express();

        this.pathToKeyPem = nodePath.join(this.container.config.application.basePath, 'config/key.pem');
        this.pathToCertPem = nodePath.join(this.container.config.application.basePath, 'config/cert.pem');
    }

    public async start(): Promise<void> {
        this.router.enable('strict routing');
        this.router.use(helmet());
        this.router.use(compression());
        this.router.use(bodyParser.urlencoded({ extended: false }));

        const publicPath = nodePath.join(this.container.config.application.basePath, 'public');

        if (await this.container.service.fs.isDirectory(publicPath)) {
            this.router.use(express.static(publicPath, { maxAge: '30 days' }));
        }

        // register access middleware
        const accessMiddleware = new AccessMiddleware(new LoggerService(this.container, 'middleware', 'access'));
        this.router.use(accessMiddleware.handle.bind(accessMiddleware));

        this.registerRoutes();

        // register error middleware
        const errorMiddleware = new ErrorMiddleware(new LoggerService(this.container, 'middleware', 'error'));
        this.router.use(errorMiddleware.handle.bind(errorMiddleware));

        // register not found middleware
        const notFoundMiddleware = new NotFoundMiddleware();
        this.router.use(notFoundMiddleware.handle.bind(notFoundMiddleware));

        // this.router.engine('pug', app.module.renderer.render.bind(app.module.renderer));

        this.router.set('views', this.container.config.server.viewPaths);
        this.router.set('view engine', 'pug');

        let server = null;

        // check certificates
        if (
            !(await this.container.service.fs.isFile(this.pathToKeyPem)) ||
            !(await this.container.service.fs.isFile(this.pathToCertPem))
        ) {
            await this.logger.warning(`.key and .pem files missing`, [this.pathToKeyPem, this.pathToCertPem]);
            server = this.router;
        } else {
            // start https server
            server = https.createServer(
                {
                    cert: await this.container.service.fs.readFile(this.pathToCertPem),
                    key: await this.container.service.fs.readFile(this.pathToKeyPem),
                },
                this.router,
            );
        }

        this.connection = server.listen(this.container.config.server.port);

        await this.logger.notice('started');

        // TODO: start server
    }

    public async stop() {
        await this.connection.close();

        await this.logger.notice('stopped');
    }

    private registerRoutes() {
        for (const route of this.container.config.server.routes) {
            for (const middleware of this.container.config.server.middlewares) {
                for (const method of route.methods) {
                    switch (method) {
                        case 'get':
                            this.router.get(route.path, middleware.handle.bind(middleware));
                            break;
                        case 'post':
                            this.router.post(route.path, middleware.handle.bind(middleware));
                            break;
                        default:
                            throw new Error('method ' + method + ' is not supported');
                    }
                }
            }

            for (const method of route.methods) {
                switch (method) {
                    case 'get':
                        this.router.get(route.path, route.handler.handle.bind(route.handler));
                        break;
                    case 'post':
                        this.router.post(route.path, route.handler.handle.bind(route.handler));
                        break;
                    default:
                        throw new Error('method ' + method + ' is not supported');
                }
            }
        }
    }
}
