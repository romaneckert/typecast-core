import { Connection, createConnection } from 'typeorm';
import { ApplicationConfig } from '../config/application-config';
import { ILogger } from '../interface/logger-interface';

export class DatabaseService {
    public connection: Connection;
    public logger: ILogger;
    private applicationConfig: ApplicationConfig;

    constructor(logger: ILogger, applicationConfig: ApplicationConfig) {
        this.logger = logger;
        this.applicationConfig = applicationConfig;
    }

    public async start(): Promise<void> {
        let fileType = 'js';

        if ('test' === this.applicationConfig.context) {
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

    public async stop() {
        await this.connection.close();
    }
}
