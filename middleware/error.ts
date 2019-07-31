import express from 'express';
import { Middleware } from '../decorator/middleware';
import LoggerService from '../service/logger';

@Middleware()
export default class ErrorMiddleware {
    private logger: LoggerService;

    public constructor(logger: LoggerService) {
        this.logger = logger;
    }

    public async handle(err: any, req: express.Request, res: express.Response, next: () => void): Promise<void> {
        this.logger.error(req.url + ' ' + err);
        res.status(500);
        return res.render('status-500');
    }
}
