import * as nodePath from 'path';
import { Connection, createConnection, Repository, ConnectionOptions } from 'typeorm';
import ApplicationConfig from '../config/application-config';
import DatabaseConfig from '../config/database-config';
import Service from '../decorator/service';
import FileSystemUtil from '../util/file-system';
import LoggerService from './logger';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Service()
export default class DatabaseService {
    public connected: boolean = false;

    private connection: Connection;
    private applicationConfig: ApplicationConfig;
    private databaseConfig: DatabaseConfig;
    private logger: LoggerService;

    public constructor(applicationConfig: ApplicationConfig, databaseConfig: DatabaseConfig, logger: LoggerService) {
        this.applicationConfig = applicationConfig;
        this.databaseConfig = databaseConfig;
        this.logger = logger;
    }

    public async start(): Promise<void> {
        const config: MysqlConnectionOptions = {
            database: this.databaseConfig.database,
            username: this.databaseConfig.username,
            password: this.databaseConfig.password,
            entities: await this.getEntityPaths(),
            host: this.databaseConfig.host,
            synchronize: true,
            type: 'mysql',
        };

        const connection = await createConnection(config);

        if (null === connection) {
            await this.logger.critical(`can not connect to db "${this.databaseConfig.database}"`);
        } else {
            this.connected = true;
            this.connection = connection;
            await this.logger.notice(`connected to db "${this.databaseConfig.database}"`);
        }
    }

    public getRepository(type: any): Repository<any> {
        return this.connection.getRepository(type);
    }

    public async drop(): Promise<void> {
        await this.connection.dropDatabase();
        await this.connection.synchronize();
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
