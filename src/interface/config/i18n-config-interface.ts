import { IConfig } from './config-interface';

export interface II18nConfig extends IConfig {
    locales: string[];
    defaultLocale: string;
}
