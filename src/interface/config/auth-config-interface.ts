import { IConfig } from './config-interface';

export interface IAuthConfig extends IConfig {
    tokenExpiresIn: number;
    tokenCookieName: string;
    secret: string;
}
