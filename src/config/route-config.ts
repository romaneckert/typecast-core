import { Container } from '../container';
import { ContainerAware } from '../core/container-aware';
import { IndexHandler } from '../handler/index-handler';
import { PasswordHandler } from '../handler/typecast/user/password-handler';
import { SignInHandler } from '../handler/typecast/user/sign-in-handler';
import { SignOutHandler } from '../handler/typecast/user/sign-out-handler';
import { IConfig } from '../interface/config-interface';
import { Route } from '../service/router/route';

export class RouteConfig extends ContainerAware implements IConfig {
    public index: Route;
    public userPassword: Route;
    public userSignIn: Route;
    public userSignOut: Route;

    constructor(container: Container) {
        super(container);

        this.index = new Route('/', new IndexHandler(container));
        this.userPassword = new Route(
            '/typecast/user/password/:passwordToken',
            new PasswordHandler(container),
            ['get', 'post'],
            '/typecast/user/password',
        );

        this.userSignIn = new Route('/typecast/user/sign-in', new SignInHandler(container), ['get', 'post']);
        this.userSignOut = new Route('/typecast/user/sign-out', new SignOutHandler(container));
    }

    public validate() {
        return;
    }
}
