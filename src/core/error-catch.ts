import express from 'express';
import { IRouteHandler } from '../interface/router-handler';

export class ErrorCatchHandler {
    public routeHandler: IRouteHandler;

    constructor(routeHandler: IRouteHandler) {
        this.routeHandler = routeHandler;
    }

    public async handle(req: express.Request, res: express.Response, next: (arg?: any) => void): Promise<void> {
        try {
            return await this.routeHandler.handle(req, res, next);
        } catch (err) {
            next(err);
        }
    }
}
