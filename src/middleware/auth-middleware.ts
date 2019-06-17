import express from 'express';
import { IMiddleware } from '../interface/middleware-interface';

export class AuthMiddleware implements IMiddleware {
    public async handle(req: express.Request, res: express.Response, next: () => void) {
        // TODO: add auth middleware

        return next();
    }
}
