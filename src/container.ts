import { EntityManager } from 'typeorm';
import { ApplicationConfig } from './config/application-config';
import { I18nConfig } from './config/i18n-config';
import { ServerConfig } from './config/server-config';
import { DatabaseService } from './service/database-service';
import { FileSystemService } from './service/file-system-service';
import { I18nService } from './service/i18n-service';
import { RendererService } from './service/renderer-service';
import { ServerService } from './service/server-service';

export class Container {
    public config: {
        application: ApplicationConfig;
        i18n: I18nConfig;
        server: ServerConfig;
    };

    public service: {
        database: DatabaseService;
        fs: FileSystemService;
        i18n: I18nService;
        renderer: RendererService;
        server: ServerService;
    };

    public get entityManager(): EntityManager {
        return this.service.database.connection.manager;
    }
}
