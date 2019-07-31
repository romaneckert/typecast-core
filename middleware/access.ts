import express from 'express';
import { Middleware } from '../decorator/middleware';
import { IMiddleware } from '../interface/middleware';
import LoggerService from '../service/logger';

@Middleware()
export default class AccessMiddleware implements IMiddleware {
    private logger: LoggerService;

    public constructor(logger: LoggerService) {
        this.logger = logger;
    }

    public async handle(req: express.Request, res: express.Response, next: () => void) {
        await this.logger.info(req.url);

        return next();
    }
}
