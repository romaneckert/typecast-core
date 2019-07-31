import express from 'express';
import { IMiddleware } from '../interface/middleware';
import IRoute from '../interface/route';

export default class HandleMiddleware implements IMiddleware {
    public route: IRoute;

    constructor(route: IRoute) {
        this.route = route;
    }

    public async handle(req: express.Request, res: express.Response, next: (arg?: any) => void): Promise<any> {
        try {
            return await this.route.handle(req, res, next);
        } catch (err) {
            next(err);
        }
    }
}
