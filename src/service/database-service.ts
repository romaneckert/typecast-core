import { Connection, createConnection } from 'typeorm';
import { Container } from '../container';
import { ILogger } from '../interface/logger-interface';
import { LoggerService } from './logger-service';

export class DatabaseService {
    public connection: Connection;
    public container: Container;
    private logger: ILogger;

    constructor(container: Container) {
        this.container = container;
        this.logger = new LoggerService(container, 'service', 'database');
    }

    public async start(): Promise<void> {
        let fileType = 'js';

        if ('test' === this.container.config.application.context) {
            fileType = 'ts';
        }

        try {
            this.connection = await createConnection({
                database: 'typecast-core',
                entities: [__dirname + '/../entity/*.' + fileType],
                host: 'localhost',
                synchronize: true,
                type: 'mongodb',
                useNewUrlParser: true,
            });
        } catch (err) {
            await this.logger.critical('can not connect to db', err);
        }

        await this.logger.notice('connected to db');
    }

    public async stop(): Promise<boolean> {
        if (null === this.connection) {
            return false;
        }

        await this.connection.close();

        return true;
    }
}
