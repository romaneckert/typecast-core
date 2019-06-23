import { ViewHelper } from '../decorator/view-helper';
import { ServerService } from '../service/server-service';

@ViewHelper()
export class UrlViewHelper {
    private server: ServerService;

    public render(routeName: string, data: { [key: string]: any }): string {
        // TODO: fix
        /*
        if (!(this.server.routes[routeName] instanceof Route)) {
            throw new Error(`route with name ${routeName} does not exists`);
        }

        return this.server.routes[routeName].path.replace(/(\/:\w+\??)/g, (m: any, c: any) => {
            c = c.replace(/[/:?]/g, '');
            return data[c] ? '/' + data[c] : '';
        });*/

        return '';
    }
}
