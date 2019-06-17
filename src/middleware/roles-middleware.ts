import express from 'express';
import { IMiddleware } from '../interface/middleware-interface';

export class RolesMiddleware implements IMiddleware {
    public async handle(req: express.Request, res: express.Response, next: () => void) {
        // TODO: add roles middleware

        return next();
    }
}
