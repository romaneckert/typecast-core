import * as nodePath from 'path';
import { ApplicationConfig } from './config/application-config';
import { ServerConfig } from './config/server-config';
import { Container } from './container';
import { IndexHandler } from './handler/index-handler';
import { AuthMiddleware } from './middleware/auth-middleware';
import { LocaleMiddleware } from './middleware/locale-middleware';
import { RolesMiddleware } from './middleware/roles-middleware';
import { DatabaseService } from './service/database-service';
import { FileSystemService } from './service/file-system-service';
import { LoggerService } from './service/logger-service';
import { Route } from './service/router/route';
import { ServerService } from './service/server-service';

export class Application {
    public container: Container;

    public logger: LoggerService;

    constructor() {
        this.container = new Container();

        const applicationConfig = new ApplicationConfig();
        const serverConfig = new ServerConfig(
            3000,
            [
                new Route('index', '/', new IndexHandler(this.container)),
                // new Route('typecast_user_sign_in', 'typecast/user/sign-in', ['get', 'post'], ),
            ],
            [new AuthMiddleware(), new RolesMiddleware(), new LocaleMiddleware()],
            [nodePath.join(applicationConfig.basePath, 'view', 'template')],
        );

        this.container.config = {
            application: applicationConfig,
            server: serverConfig,
        };

        this.logger = new LoggerService(this.container, 'application', 'application');
    }

    public async start() {
        const fileSystemService = new FileSystemService();
        const databaseService = new DatabaseService(this.container);

        const serverService = new ServerService(this.container);

        this.container.service = {
            database: databaseService,
            fs: fileSystemService,
            server: serverService,
        };

        await this.container.service.database.start();

        // start server service
        await this.container.service.server.start();
    }

    public async stop() {
        // stop database
        await this.container.service.database.stop();

        // stop server
        await this.container.service.server.stop();
    }
}
