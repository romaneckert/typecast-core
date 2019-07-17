import * as nodePath from 'path';
import { Connection, createConnection, Repository } from 'typeorm';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { ApplicationConfig } from '../config/application-config';
import { DatabaseConfig } from '../config/database-config';
import { Service } from '../decorator/service';
import { FileSystemUtil } from '../util/file-system';
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
            entities: await this.getEntityPaths(),
            host: this.config.host,
            reconnectTries: 2,
            synchronize: true,
            type: 'mongodb',
            useNewUrlParser: true,
        };

        const connection = await createConnection(config);

        if (null === connection) {
            await this.logger.critical(`can not connect to db "${this.config.database}"`);
        } else {
            this.connected = true;
            this.connection = connection;
            await this.logger.notice(`connected to db "${this.config.database}"`);
        }
    }

    public getRepository(type: any): Repository<any> {
        return this.connection.getRepository(type);
    }

    public async drop(): Promise<void> {
        await this.connection.dropDatabase();
    }

    public async stop(): Promise<boolean> {
        if (undefined === this.connection) {
            return false;
        }

        await this.connection.close();

        return true;
    }

    private async getEntityPaths(): Promise<string[]> {
        const entityPaths: string[] = [];

        for (const applicationPath of this.applicationConfig.paths) {
            const entityPath = nodePath.join(applicationPath, 'entity');

            if (await FileSystemUtil.isDirectory(entityPath)) {
                entityPaths.push(nodePath.join(entityPath, '**.*'));
            }
        }

        return entityPaths;
    }
}
