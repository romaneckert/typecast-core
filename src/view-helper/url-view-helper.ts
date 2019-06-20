import { ContainerAware } from '../core/container-aware';
import { Route } from '../service/router/route';

export class UrlViewHelper extends ContainerAware {
    public render(routeName: string, data: { [key: string]: any }): string {
        if (!(this.container.service.server.routes[routeName] instanceof Route)) {
            throw new Error(`route with name ${routeName} does not exists`);
        }

        return this.container.service.server.routes[routeName].path.replace(/(\/:\w+\??)/g, (m: any, c: any) => {
            c = c.replace(/[/:?]/g, '');
            return data[c] ? '/' + data[c] : '';
        });
    }
}
