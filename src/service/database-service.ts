import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { Component } from '../core/component';
import { Inject } from '../core/inject';
import { IApplicationConfig } from '../interface/config/application-config-interface';
import { IDatabaseConfig } from '../interface/config/database-config-interface';
import { ILoggerService } from '../interface/service/logger-service-interface';

@Component('service', 'database')
export class DatabaseService {
    public connection?: Connection;

    @Inject('config', 'application')
    private applicationConfig: IApplicationConfig;

    @Inject('config', 'database')
    private config: IDatabaseConfig;

    @Inject('service', 'logger', 'service', 'database')
    private logger: ILoggerService;

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
