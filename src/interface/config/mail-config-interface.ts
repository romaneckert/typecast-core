import { IConfig } from './config-interface';

export interface IMailConfig extends IConfig {
    defaultFrom: string;
    connectionTimeout: number;
    url: string;
}
