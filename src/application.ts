import * as nodePath from 'path';
import { ApplicationConfig } from './config/application-config';
import { I18nConfig } from './config/i18n-config';
import { RouteContainer } from './config/route-config';
import { ServerConfig } from './config/server-config';
import { Container } from './container';
import { AuthMiddleware } from './middleware/auth-middleware';
import { LocaleMiddleware } from './middleware/locale-middleware';
import { RolesMiddleware } from './middleware/roles-middleware';
import { DatabaseService } from './service/database-service';
import { FileSystemService } from './service/file-system-service';
import { I18nService } from './service/i18n-service';
import { LoggerService } from './service/logger-service';
import { RendererService } from './service/renderer-service';
import { ServerService } from './service/server-service';

export class Application {
    public container: Container;

    public logger: LoggerService;

    constructor() {
        this.container = new Container();

        const applicationConfig = new ApplicationConfig();
        const i18nConfig = new I18nConfig();
        i18nConfig.defaultLocale = 'de';
        i18nConfig.locales = ['de'];
        i18nConfig.localePaths = [nodePath.join(applicationConfig.basePath, 'locale')];
        const serverConfig = new ServerConfig(
            this.container,
            3000,
            [new RouteContainer(this.container)],
            [new AuthMiddleware(), new RolesMiddleware(), new LocaleMiddleware(this.container)],
            [nodePath.join(applicationConfig.basePath, 'view', 'template')],
        );

        this.container.config = {
            application: applicationConfig,
            i18n: i18nConfig,
            server: serverConfig,
        };

        this.logger = new LoggerService(this.container, 'application', 'application');
    }

    public async start() {
        const fileSystemService = new FileSystemService();
        const databaseService = new DatabaseService(this.container);
        const serverService = new ServerService(this.container);
        const rendererService = new RendererService(this.container);
        const i18nService = new I18nService(this.container);

        this.container.service = {
            database: databaseService,
            fs: fileSystemService,
            i18n: i18nService,
            renderer: rendererService,
            server: serverService,
        };

        // start database service
        await this.container.service.database.start();

        // start i18n service
        await this.container.service.i18n.start();

        // start renderer service
        await this.container.service.renderer.start();

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
