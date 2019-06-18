import { IMiddleware } from '../interface/middleware-interface';
import { IRouteContainer } from '../interface/route-container-interface';

export class ServerConfig {
    public port: number;
    public middlewares: IMiddleware[];
    public routeContainers: IRouteContainer[];
    public viewPaths: string[];

    constructor(port: number, routeContainers: IRouteContainer[], middlewares: IMiddleware[], viewPaths: string[]) {
        this.port = port;
        this.middlewares = middlewares;
        this.routeContainers = routeContainers;
        this.viewPaths = viewPaths;
    }
}
