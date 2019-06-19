import * as nodePath from 'path';
import { ApplicationConfig } from './config/application-config';
import { AuthConfig } from './config/auth-config';
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
        this.logger = new LoggerService(this.container, 'application', 'application');

        const applicationConfig = new ApplicationConfig();
        const authConfig = new AuthConfig();
        const i18nConfig = new I18nConfig();
        const serverConfig = new ServerConfig(this.container);

        this.container.config = {
            application: applicationConfig,
            auth: authConfig,
            i18n: i18nConfig,
            server: serverConfig,
        };

        this.container.config.i18n.localePaths = ['locale'];
        this.container.config.server.routeContainers = [new RouteContainer(this.container)];
        this.container.config.server.middlewares = [
            new AuthMiddleware(),
            new RolesMiddleware(),
            new LocaleMiddleware(this.container),
        ];
        this.container.config.server.viewPaths = ['view/template'];
        this.container.config.server.publicPaths = ['public'];
    }

    public initConfig() {
        this.container.config.i18n.locales = ['de'];
        this.container.config.i18n.defaultLocale = 'de';
    }

    public async start() {
        this.initConfig();

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
