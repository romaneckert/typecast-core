import { Route } from '../../service/router/route';
import { IMiddleware } from '../middleware-interface';
import { IConfig } from './config-interface';

export interface IServerConfig extends IConfig {
    port: number;
    middlewares: IMiddleware[];
    viewHelper: { [key: string]: any };
    routes: Route[];
}
