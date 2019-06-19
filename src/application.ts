import * as dotenv from 'dotenv';
import { ApplicationConfig } from './config/application-config';
import { AuthConfig } from './config/auth-config';
import { DatabaseConfig } from './config/database-config';
import { I18nConfig } from './config/i18n-config';
import { MailConfig } from './config/mail-config';
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
import { MailService } from './service/mail-service';
import { RendererService } from './service/renderer-service';
import { ServerService } from './service/server-service';

export class Application {
    public container: Container;

    public logger: LoggerService;

    constructor() {
        dotenv.config();

        this.container = new Container();
        this.logger = new LoggerService(this.container, 'application', 'application');

        this.container.config = {
            application: new ApplicationConfig(),
            auth: new AuthConfig(),
            database: new DatabaseConfig(),
            i18n: new I18nConfig(),
            mail: new MailConfig(),
            server: new ServerConfig(this.container),
        };

        this.container.config.server.routeContainers = [new RouteContainer(this.container)];
        this.container.config.server.middlewares = [
            new AuthMiddleware(),
            new RolesMiddleware(),
            new LocaleMiddleware(this.container),
        ];
    }

    public initConfig() {
        this.container.config.i18n.locales = ['de'];
        this.container.config.i18n.defaultLocale = 'de';
    }

    public async start() {
        this.initConfig();
        this.validateConfig();

        const databaseService = new DatabaseService(this.container);
        const fileSystemService = new FileSystemService();
        const i18nService = new I18nService(this.container);
        const mailService = new MailService(this.container);
        const rendererService = new RendererService(this.container);
        const serverService = new ServerService(this.container);

        this.container.service = {
            database: databaseService,
            fs: fileSystemService,
            i18n: i18nService,
            mail: mailService,
            renderer: rendererService,
            server: serverService,
        };

        // start database service
        await this.container.service.database.start();

        // start mail service
        await this.container.service.mail.start();

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

    private validateConfig() {
        for (const [key, config] of Object.entries(this.container.config)) {
            config.validate();
        }
    }
}
