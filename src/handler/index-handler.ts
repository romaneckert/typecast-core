import express from 'express';
import { ILogger } from '../interface/logger-interface';
import { IRouteHandler } from '../interface/route-handler-interface';

export class IndexHandler implements IRouteHandler {
    protected logger: ILogger;

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        return res.render('index');
    }
}
