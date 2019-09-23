import express from 'express';
import Middleware from '../decorator/middleware';
import IMiddleware from '../interface/middleware';

@Middleware()
export default class NotFoundMiddleware implements IMiddleware {
    public async handle(req: express.Request, res: express.Response): Promise<void | express.Response> {
        if (['application/json'].includes(String(req.headers['content-type']))) {
            return res.status(404).json({
                status: 404,
            });
        }

        res.status(404);
        return res.render('status-404');
    }
}
