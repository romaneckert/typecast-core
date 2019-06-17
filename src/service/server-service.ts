import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import * as https from 'https';
import * as nodePath from 'path';
import { ApplicationConfig } from '../config/application-config';
import { ServerConfig } from '../config/server-config';
import { ILogger } from '../interface/logger-interface';
import { AccessMiddleware } from '../middleware/access-middleware';
import { ErrorMiddleware } from '../middleware/error-middleware';
import { NotFoundMiddleware } from '../middleware/not-found-middleware';
import { FileSystemService } from './file-system-service';
import { LoggerService } from './logger-service';

export class ServerService {
    public logger: ILogger;
    private router: express.Application;
    private applicationConfig: ApplicationConfig;
    private config: ServerConfig;
    private fileSystemService: FileSystemService;

    private pathToKeyPem: string;
    private pathToCertPem: string;

    constructor(
        config: ServerConfig,
        applicationConfig: ApplicationConfig,
        logger: ILogger,
        fileSystemService: FileSystemService,
    ) {
        this.config = config;
        this.applicationConfig = applicationConfig;
        this.logger = logger;
        this.fileSystemService = fileSystemService;

        this.pathToKeyPem = nodePath.join(applicationConfig.basePath, 'config/key.pem');
        this.pathToCertPem = nodePath.join(applicationConfig.basePath, 'config/cert.pem');
    }

    public async start(): Promise<void> {
        this.router = express();
        this.router.enable('strict routing');
        this.router.use(helmet());
        this.router.use(compression());
        this.router.use(bodyParser.urlencoded({ extended: false }));

        const publicPath = nodePath.join(this.applicationConfig.basePath, 'public');

        if (await this.fileSystemService.isDirectory(publicPath)) {
            this.router.use(express.static(publicPath, { maxAge: '30 days' }));
        }

        // register access middleware
        const accessMiddlewareLogger = new LoggerService(
            'middleware',
            'access',
            this.applicationConfig,
            this.fileSystemService,
        );

        accessMiddlewareLogger.databaseConnection = this.logger.databaseConnection;
        const accessMiddleware = new AccessMiddleware(accessMiddlewareLogger);

        this.router.use(accessMiddleware.handle.bind(accessMiddleware));

        this.registerRoutes();

        // register error middleware
        const errorMiddlewareLogger = new LoggerService(
            'middleware',
            'error',
            this.applicationConfig,
            this.fileSystemService,
        );

        errorMiddlewareLogger.databaseConnection = this.logger.databaseConnection;
        const errorMiddleware = new ErrorMiddleware(errorMiddlewareLogger);

        this.router.use(errorMiddleware.handle.bind(errorMiddleware));

        // register not found middleware
        const notFoundMiddleware = new NotFoundMiddleware();
        this.router.use(notFoundMiddleware.handle.bind(notFoundMiddleware));

        // this.router.engine('pug', app.module.renderer.render.bind(app.module.renderer));

        this.router.set('views', this.config.viewPaths);
        this.router.set('view engine', 'pug');

        let server = null;

        // check certificates
        if (
            !(await this.fileSystemService.isFile(this.pathToKeyPem)) ||
            !(await this.fileSystemService.isFile(this.pathToCertPem))
        ) {
            await this.logger.warning(`.key and .pem files missing`, [this.pathToKeyPem, this.pathToCertPem]);
            server = this.router;
        } else {
            // start https server
            server = https.createServer(
                {
                    cert: await this.fileSystemService.readFile(this.pathToCertPem),
                    key: await this.fileSystemService.readFile(this.pathToKeyPem),
                },
                this.router,
            );
        }

        server.listen(this.config.port);

        await this.logger.notice('server started');

        // TODO: start server
    }

    private registerRoutes() {
        for (let route of this.config.routes) {
        }
    }

    public stop() {
        // TODO: stop server
    }
}
