import express from 'express';

export interface IRouteHandler {
    handle(req: express.Request, res: express.Response, next: () => void): Promise<void>;
}
