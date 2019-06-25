import express from 'express';
import { IMiddleware } from '../interface/middleware';
import { IRoute } from '../interface/route';

export class TypeMiddleware implements IMiddleware {
    public route: IRoute;

    constructor(route: IRoute) {
        this.route = route;
    }

    public async handle(req: express.Request, res: express.Response, next: (arg?: any) => void): Promise<any> {
        try {
            if (['application/json'].includes(String(req.headers['content-type'])) && 'function' === typeof this.route.handleJson) {
                return await this.route.handleJson(req, res, next);
            }

            return await this.route.handle(req, res, next);
        } catch (err) {
            next(err);
        }
    }
}
