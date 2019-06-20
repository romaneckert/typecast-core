import { IRouteHandler } from '../../interface/route-handler-interface';

export class Route {
    public name: string;
    public methods: string[];
    public path: string;
    public handler: IRouteHandler;
    public disabled: boolean = false;

    constructor(name: string, handler: IRouteHandler, methods: string[] = ['get'], path?: string) {
        this.name = name;
        this.handler = handler;
        this.methods = methods;

        if (undefined === path) {
            this.path = name;
        } else {
            this.name = path;
        }
    }
}
