import { ApplicationConfig } from './config/application-config';
import { DatabaseService } from './service/database-service';
import { FileSystemService } from './service/file-system-service';
import { LoggerService } from './service/logger-service';
import { ServerService } from './service/server-service';
import { file } from '@babel/types';

export class Application {
    public service: {
        database: DatabaseService;
        server: ServerService;
    };

    constructor() {
        const applicationConfig = new ApplicationConfig();
        const fileSystemService = new FileSystemService();

        this.service = {
            database: new DatabaseService(
                new LoggerService('service', 'database', applicationConfig, fileSystemService),
                applicationConfig,
            ),
            server: new ServerService(new LoggerService('service', 'server', applicationConfig, fileSystemService)),
        };
    }

    public async start() {
        // start database service
        await this.service.database.start();

        // add database connection to all logger
        this.service.server.logger.databaseConnection = this.service.database.connection;
        this.service.database.logger.databaseConnection = this.service.database.connection;

        // start server service
        await this.service.server.start();
    }

    public async stop() {
        // stop database
        await this.service.database.stop();

        // stop server
        await this.service.server.stop();
    }
}
