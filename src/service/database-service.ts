import { Connection, createConnection } from 'typeorm';
import { ILogger } from '../interface/logger-interface';
import { IService } from '../interface/service-interface';

export class DatabaseService implements IService {
    public connection: Connection;
    public logger: ILogger;

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    public async start(): Promise<void> {
        try {
            this.connection = await createConnection({
                database: 'typecast-core',
                entities: [__dirname + '/../entity/*.ts'],
                host: 'localhost',
                synchronize: true,
                type: 'mongodb',
                useNewUrlParser: true,
            });
        } catch (err) {
            await this.logger.critical('can not connect to db', err);
        }

        await this.logger.info('connected to db');
    }

    public async stop() {
        await this.connection.close();
    }
}
