import { Container } from '../container';
import { ContainerAware } from '../core/container-aware';
import { IConfig } from '../interface/config-interface';
import { IMiddleware } from '../interface/middleware-interface';
import { IRouteContainer } from '../interface/route-container-interface';
import { AssetViewHelper } from '../view-helper/asset-view-helper';
import { TranslateViewHelper } from '../view-helper/translate-view-helper';
import { UrlViewHelper } from '../view-helper/url-view-helper';

export class ServerConfig extends ContainerAware implements IConfig {
    public port: number = 3000;
    public middlewares: IMiddleware[];
    public routeContainers: IRouteContainer[];
    public viewPaths: string[];
    public publicPaths: string[];
    public viewHelper: { [key: string]: any } = {};

    constructor(container: Container) {
        super(container);

        this.viewHelper.asset = new AssetViewHelper(this.container);
        this.viewHelper.translate = new TranslateViewHelper(this.container);
        this.viewHelper.url = new UrlViewHelper(this.container);
    }

    public validate() {
        return;
    }
}
