import { Container } from '../container';
import { ContainerAware } from '../core/container-aware';
import { IMiddleware } from '../interface/middleware-interface';
import { IRouteContainer } from '../interface/route-container-interface';
import { AssetViewHelper } from '../view-helper/asset-view-helper';
import { TranslateViewHelper } from '../view-helper/translate-view-helper';
import { UrlViewHelper } from '../view-helper/url-view-helper';

export class ServerConfig extends ContainerAware {
    public port: number;
    public middlewares: IMiddleware[];
    public routeContainers: IRouteContainer[];
    public viewPaths: string[];
    public viewHelper: {
        [key: string]: any;
    } = {};

    constructor(
        container: Container,
        port: number,
        routeContainers: IRouteContainer[],
        middlewares: IMiddleware[],
        viewPaths: string[],
    ) {
        super(container);

        this.port = port;
        this.middlewares = middlewares;
        this.routeContainers = routeContainers;
        this.viewPaths = viewPaths;

        this.viewHelper.asset = new AssetViewHelper(this.container);
        this.viewHelper.translate = new TranslateViewHelper(this.container);
        this.viewHelper.url = new UrlViewHelper(this.container);
    }
}
