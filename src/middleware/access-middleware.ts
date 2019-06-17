import express from 'express';
import { LoggerService } from '../service/logger-service';

export class AccessMiddleware {
    public logger: LoggerService;

    constructor(logger: LoggerService) {
        this.logger = logger;
    }

    public async handle(req: express.Request, res: express.Response, next: () => void) {
        await this.logger.info(req.url);

        return next();
    }
}
