import express from 'express';
import { IRoute } from '../interface/route';

export class ErrorCatchHandler {
    public route: IRoute;

    constructor(route: IRoute) {
        this.route = route;
    }

    public async handle(req: express.Request, res: express.Response, next: (arg?: any) => void): Promise<void> {
        try {
            return await this.route.handle(req, res, next);
        } catch (err) {
            next(err);
        }
    }
}
