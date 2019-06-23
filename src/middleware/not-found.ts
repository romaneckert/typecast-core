import express from 'express';
import { Middleware } from '../decorator/middleware';
import { IMiddleware } from '../interface/middleware';

@Middleware()
export class NotFoundMiddleware implements IMiddleware {
    public async handle(req: express.Request, res: express.Response): Promise<void> {
        res.status(404);
        return res.render('status-404');
    }
}
