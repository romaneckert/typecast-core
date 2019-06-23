import express from 'express';
import { Middleware } from '../decorator/middleware';
import { IMiddleware } from '../interface/middleware';

@Middleware()
export class AuthMiddleware implements IMiddleware {
    public async handle(req: express.Request, res: express.Response, next: () => void) {
        // TODO: add auth middleware

        return next();
    }
}
