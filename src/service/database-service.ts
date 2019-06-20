import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { Container } from '../container';
import { ContainerAware } from '../core/container-aware';
import { ILogger } from '../interface/logger-interface';
import { LoggerService } from './logger-service';

export class DatabaseService extends ContainerAware {
    public connection?: Connection;
    private logger: ILogger;

    constructor(container: Container) {
        super(container);
        this.logger = new LoggerService(container, 'service', 'database');
    }

    public async start(): Promise<void> {
        let fileType = 'js';

        if ('test' === this.container.config.application.context) {
            fileType = 'ts';
        }

        const config: ConnectionOptions = {
            database: this.container.config.database.database,
            entities: [__dirname + '/../entity/*.' + fileType],
            host: this.container.config.database.host,
            synchronize: true,
            type: 'mongodb',
            useNewUrlParser: true,
        };

        const connection = await createConnection(config);

        if (null === connection) {
            this.connection = undefined;
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
