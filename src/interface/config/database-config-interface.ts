import { IConfig } from './config-interface';

export interface IDatabaseConfig extends IConfig {
    host: string;
    database?: string;
}
