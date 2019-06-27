import { Connection, createConnection, Repository } from 'typeorm';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { ApplicationConfig } from '../config/application-config';
import { DatabaseConfig } from '../config/database-config';
import { Service } from '../decorator/service';
import { LoggerService } from './logger';

@Service()
export class DatabaseService {
    public connected: boolean = false;

    private connection: Connection;
    private applicationConfig: ApplicationConfig;
    private config: DatabaseConfig;
    private logger: LoggerService;

    public constructor(applicationConfig: ApplicationConfig, config: DatabaseConfig, logger: LoggerService) {
        this.applicationConfig = applicationConfig;
        this.config = config;
        this.logger = logger;
    }

    public async start(): Promise<void> {
        const config: MongoConnectionOptions = {
            database: this.config.database,
            entities: [__dirname + '/../entity/*.js'],
            host: this.config.host,
            reconnectTries: 2,
            synchronize: true,
            type: 'mongodb',
            useNewUrlParser: true,
        };

        const connection = await createConnection(config);

        if (null === connection) {
            await this.logger.critical('can not connect to db');
        } else {
            this.connected = true;
            this.connection = connection;
            await this.logger.notice('connected to db');
        }
    }

    public getRepository(type: any): Repository<any> {
        return this.connection.getRepository(type);
    }

    public async stop(): Promise<boolean> {
        if (undefined === this.connection) {
            return false;
        }

        await this.connection.close();

        return true;
    }
}
