import express from 'express';
import { IMiddleware } from '../interface/middleware-interface';

export class LocaleMiddleware implements IMiddleware {
    public async handle(req: express.Request, res: express.Response, next: () => void) {
        // TODO: add locale middleware

        return next();
    }
}
