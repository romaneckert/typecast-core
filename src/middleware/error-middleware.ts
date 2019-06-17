import express from 'express';
import { LoggerService } from '../service/logger-service';

export class ErrorMiddleware {
    public logger: LoggerService;

    constructor(logger: LoggerService) {
        this.logger = logger;
    }

    public async handle(err: any, req: express.Request, res: express.Response, next: () => void) {
        console.log(typeof err);

        await this.logger.error(req.url + ' ' + err.message);
        return next();
    }
}
