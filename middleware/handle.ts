import express from 'express';
import IMiddleware from '../interface/middleware';
import Middleware from '../decorator/middleware';

@Middleware()
export default class HandleMiddleware implements IMiddleware {
    public route: any;

    constructor(route: any) {
        this.route = route;
    }

    public async handle(req: express.Request, res: express.Response, next: (arg?: any) => void): Promise<any> {
        try {
            if ('function' !== typeof this.route.handle) {
                return next(new Error('route has no handle function'));
            }

            return await this.route.handle(req, res, next);
        } catch (err) {
            return next(err);
        }
    }
}
