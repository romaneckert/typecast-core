import { Container } from '../container';
import { ContainerAware } from '../core/container-aware';
import { IndexHandler } from '../handler/index-handler';
import { TypecastInstallHandler } from '../handler/typecast/install';
import { TypecastUserPasswordHandler } from '../handler/typecast/user/password-handler';
import { TypecastUserPasswordResetHandler } from '../handler/typecast/user/password-reset-handler';
import { TypecastUserSignInHandler } from '../handler/typecast/user/sign-in-handler';
import { TypecastUserSignOutHandler } from '../handler/typecast/user/sign-out-handler';

import { IConfig } from '../interface/config-interface';
import { IMiddleware } from '../interface/middleware-interface';
import { Route } from '../service/router/route';
import { AssetViewHelper } from '../view-helper/asset-view-helper';
import { TranslateViewHelper } from '../view-helper/translate-view-helper';
import { UrlViewHelper } from '../view-helper/url-view-helper';

export class ServerConfig extends ContainerAware implements IConfig {
    public port: number = 3000;
    public middlewares: IMiddleware[];
    public viewHelper: { [key: string]: any } = {};
    public routes: Route[];

    constructor(container: Container) {
        super(container);

        this.viewHelper.asset = new AssetViewHelper(this.container);
        this.viewHelper.translate = new TranslateViewHelper(this.container);
        this.viewHelper.url = new UrlViewHelper(this.container);

        this.routes = [
            new Route('/', new IndexHandler(this.container), ['get']),
            new Route('/typecast/install', new TypecastInstallHandler(container), ['get', 'post']),
            new Route('/typecast/user/password-reset', new TypecastUserPasswordResetHandler(container), [
                'get',
                'post',
            ]),
            new Route('/typecast/user/sign-in', new TypecastUserSignInHandler(container), ['get', 'post']),
            new Route('/typecast/user/sign-out', new TypecastUserSignOutHandler(container)),
            new Route(
                '/typecast/user/password',
                new TypecastUserPasswordHandler(container),
                ['get', 'post'],
                '/typecast/user/password/:passwordToken',
            ),
        ];
    }

    public addRoutes(routes: Route[]) {
        this.routes.concat(routes);
    }

    public validate() {
        return;
    }
}
