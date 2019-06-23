import { Connection, ConnectionOptions, createConnection } from 'typeorm';

import { ApplicationConfig } from '../config/application-config';
import { DatabaseConfig } from '../config/database-config';
import { Service } from '../decorator/service';
import { LoggerService } from './logger-service';

@Service()
export class DatabaseService {
    public connection: Connection;

    private applicationConfig: ApplicationConfig;
    private config: DatabaseConfig;
    private logger: LoggerService;

    public constructor(config: DatabaseConfig, applicationConfig: ApplicationConfig, logger: LoggerService) {
        this.config = config;
        this.applicationConfig = applicationConfig;
        this.logger = logger;
    }

    public async start(): Promise<void> {
        let fileType = 'js';

        if ('test' === this.applicationConfig.context) {
            fileType = 'ts';
        }

        const config: ConnectionOptions = {
            database: this.config.database,
            entities: [__dirname + '/../entity/*.' + fileType],
            host: this.config.host,
            synchronize: true,
            type: 'mongodb',
            useNewUrlParser: true,
        };

        const connection = await createConnection(config);

        if (null === connection) {
            await this.logger.critical('can not connect to db');
        } else {
            this.connection = connection;
            await this.logger.notice('connected to db');
        }
    }

    public async stop(): Promise<boolean> {
        if (undefined === this.connection) {
            return false;
        }

        await this.connection.close();

        return true;
    }
}
