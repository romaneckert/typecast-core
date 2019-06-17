import express from 'express';
import { IRouteHandler } from '../interface/route-handler-interface';

export class IndexHandler implements IRouteHandler {
    public async handle(req: express.Request, res: express.Response): Promise<void> {
        return res.render('index');
    }
}
