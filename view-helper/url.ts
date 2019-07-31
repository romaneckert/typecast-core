import ViewHelper from '../decorator/view-helper';
import IViewHelper from '../interface/view-helper';
import HTTPServerService from '../service/http-server';

@ViewHelper()
export default class UrlViewHelper implements IViewHelper {
    private server: HTTPServerService;

    public constructor(server: HTTPServerService) {
        this.server = server;
    }

    public render(routeName: string, data: { [key: string]: any }): string {
        if (undefined === this.server.routes[routeName]) {
            throw new Error(`route with name ${routeName} does not exists`);
        }

        return this.server.routes[routeName].path.replace(/(\/:\w+\??)/g, (m: any, c: any) => {
            c = c.replace(/[/:?]/g, '');
            return data[c] ? '/' + data[c] : '';
        });
    }
}
