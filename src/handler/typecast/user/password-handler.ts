import express from 'express';
import { ContainerAware } from '../../../core/container-aware';
import { IRouteHandler } from '../../../interface/route-handler-interface';

export class TypecastUserPasswordHandler extends ContainerAware implements IRouteHandler {
    public async handle(req: express.Request, res: express.Response): Promise<void> {
        // TODO:

        throw new Error('test');
    }
}
