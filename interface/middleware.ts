import express from 'express';

export interface IMiddleware {
    handle(req: express.Request, res: express.Response, next?: () => void): Promise<void | express.Response>;
}
