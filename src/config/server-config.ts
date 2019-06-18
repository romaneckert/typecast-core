import { IMiddleware } from '../interface/middleware-interface';
import { Route } from '../service/router/route';

export class ServerConfig {
    public port: number;
    public middlewares: IMiddleware[];
    public routes: Route[];
    public viewPaths: string[];

    constructor(port: number, routes: Route[], middlewares: IMiddleware[], viewPaths: string[]) {
        this.port = port;
        this.middlewares = middlewares;
        this.routes = routes;
        this.viewPaths = viewPaths;
    }
}
