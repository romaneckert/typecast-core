import { Route } from '../service/router/route';

export class ServerConfig {
    public port: number;
    public middlewares: string[];
    public routes: Route[];
    public viewPaths: string[];

    constructor(port: number, routes: Route[]) {}
}
