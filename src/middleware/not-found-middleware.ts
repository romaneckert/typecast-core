import express from 'express';
import { IMiddleware } from '../interface/middleware-interface';

export class NotFoundMiddleware implements IMiddleware {
    public async handle(req: express.Request, res: express.Response): Promise<void> {
        res.status(404);
        return res.render('status-404');
    }
}
