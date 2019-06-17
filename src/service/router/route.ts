import { IRouteHandler } from '../../interface/route-handler-interface';

export class Route {
    public name: string;
    public methods: string[];
    public path: string;
    public handler: IRouteHandler;
    public disabled: boolean = false;

    constructor(name: string, path: string, handler: IRouteHandler, methods: string[] = ['get']) {
        this.name = name;
        this.methods = methods;
        this.path = path;
        this.handler = handler;
    }
}
