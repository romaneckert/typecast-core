import { Component } from '../core/component';
import { IndexHandler } from '../handler/index-handler';
import { TypecastInstallHandler } from '../handler/typecast/install';
import { TypecastUserPasswordHandler } from '../handler/typecast/user/password-handler';
import { TypecastUserPasswordResetHandler } from '../handler/typecast/user/password-reset-handler';
import { TypecastUserSignInHandler } from '../handler/typecast/user/sign-in-handler';
import { TypecastUserSignOutHandler } from '../handler/typecast/user/sign-out-handler';
import { IServerConfig } from '../interface/config/server-config-interface';
import { IMiddleware } from '../interface/middleware-interface';
import { Route } from '../service/router/route';
import { AssetViewHelper } from '../view-helper/asset-view-helper';
import { TranslateViewHelper } from '../view-helper/translate-view-helper';
import { UrlViewHelper } from '../view-helper/url-view-helper';

@Component('config', 'server')
export class ServerConfig implements IServerConfig {
    public port: number = 3000;
    public middlewares: IMiddleware[];
    public viewHelper: { [key: string]: any } = {};
    public routes: Route[];

    constructor() {
        this.viewHelper.asset = new AssetViewHelper();
        this.viewHelper.translate = new TranslateViewHelper();
        this.viewHelper.url = new UrlViewHelper();

        this.routes = [
            new Route('/', new IndexHandler(), ['get']),
            new Route('/typecast/install', new TypecastInstallHandler(), ['get', 'post']),
            new Route('/typecast/user/password-reset', new TypecastUserPasswordResetHandler(), ['get', 'post']),
            new Route('/typecast/user/sign-in', new TypecastUserSignInHandler(), ['get', 'post']),
            new Route('/typecast/user/sign-out', new TypecastUserSignOutHandler()),
            new Route(
                '/typecast/user/password',
                new TypecastUserPasswordHandler(),
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
