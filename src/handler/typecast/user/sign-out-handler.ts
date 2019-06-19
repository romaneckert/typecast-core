import express from 'express';
import { ContainerAware } from '../../../core/container-aware';
import { IRouteHandler } from '../../../interface/route-handler-interface';

export class SignOutHandler extends ContainerAware implements IRouteHandler {
    public async handle(req: express.Request, res: express.Response): Promise<void> {
        // TODO:
    }
}
