import { IConfig } from './config-interface';

export interface IApplicationConfig extends IConfig {
    paths: string[];
    allowedContexts: string[];
    rootPath: string;
    baseUrl: string;
    buildDate: Date;
    context: string;
}
