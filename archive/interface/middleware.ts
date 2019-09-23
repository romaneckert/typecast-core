import express from 'express';

export default interface IMiddleware {
    handle(req: express.Request, res: express.Response, next?: () => void): Promise<void | express.Response>;
}
