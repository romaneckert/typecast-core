import express from 'express';

export class NotFoundMiddleware {
    public async handle(req: express.Request, res: express.Response) {
        res.status(404);
        return res.render('status-404');
    }
}
