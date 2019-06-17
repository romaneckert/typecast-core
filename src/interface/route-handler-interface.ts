import express from 'express';

export interface IRouteHandler {
    handle(req: express.Request, res: express.Response): Promise<void>;
}
