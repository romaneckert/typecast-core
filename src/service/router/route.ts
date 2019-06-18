import { IRouteHandler } from '../../interface/route-handler-interface';

export class Route {
    public name: string;
    public methods: string[];
    public path: string;
    public handler: IRouteHandler;
    public disabled: boolean = false;

    constructor(path: string, handler: IRouteHandler, methods: string[] = ['get'], name?: string) {
        if (undefined === name) {
            this.name = path;
        } else {
            this.name = name;
        }
        this.methods = methods;
        this.path = path;
        this.handler = handler;
    }
}
