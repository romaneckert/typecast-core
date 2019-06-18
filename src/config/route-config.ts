import { Container } from '../container';
import { IndexHandler } from '../handler/index-handler';
import { IRouteContainer } from '../interface/route-container-interface';
import { Route } from '../service/router/route';

export class RouteContainer implements IRouteContainer {
    public routes: Route[];

    constructor(container: Container) {
        this.routes = [new Route('index', '/', new IndexHandler(container))];
    }
}
