import { Container } from '../container';
import { IndexHandler } from '../handler/index-handler';
import { PasswordHandler } from '../handler/typecast/user/password-handler';
import { SignInHandler } from '../handler/typecast/user/sign-in-handler';
import { IRouteContainer } from '../interface/route-container-interface';
import { Route } from '../service/router/route';

export class RouteContainer implements IRouteContainer {
    public routes: Route[];

    constructor(container: Container) {
        this.routes = [
            new Route('/', new IndexHandler(container), ['get']),
            new Route(
                '/typecast/user/password/:passwordToken',
                new PasswordHandler(container),
                ['get', 'post'],
                '/typecast/user/password',
            ),
            new Route('/typecast/user/sign-in', new SignInHandler(container)),
        ];
    }
}
