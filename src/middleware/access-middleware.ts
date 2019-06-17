import express from 'express';
import { IMiddleware } from '../interface/middleware-interface';
import { LoggerService } from '../service/logger-service';

export class AccessMiddleware implements IMiddleware {
    public logger: LoggerService;

    constructor(logger: LoggerService) {
        this.logger = logger;
    }

    public async handle(req: express.Request, res: express.Response, next: () => void) {
        await this.logger.info(req.url);

        return next();
    }
}
