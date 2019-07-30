import express from 'express';
import Container from '../core/container';
import { Middleware } from '../decorator/middleware';
import { IMiddleware } from '../interface/middleware';
import { AuthService } from '../service/auth';

@Middleware()
export class AuthMiddleware implements IMiddleware {
    public async handle(req: express.Request, res: express.Response, next: () => void) {
        const authService = await Container.get<AuthService>(AuthService);
        await authService.verify(req, res);

        return next();
    }
}
