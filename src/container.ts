import { EntityManager } from 'typeorm';
import { ApplicationConfig } from './config/application-config';
import { ServerConfig } from './config/server-config';
import { DatabaseService } from './service/database-service';
import { FileSystemService } from './service/file-system-service';
import { RendererService } from './service/renderer-service';
import { ServerService } from './service/server-service';

export class Container {
    public config: {
        application: ApplicationConfig;
        server: ServerConfig;
    };

    public service: {
        database: DatabaseService;
        fs: FileSystemService;
        renderer: RendererService;
        server: ServerService;
    };

    public get entityManager(): EntityManager {
        return this.service.database.connection.manager;
    }
}
