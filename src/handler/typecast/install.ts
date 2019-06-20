import express from 'express';
import { ContainerAware } from '../../core/container-aware';
import { IRouteHandler } from '../../interface/route-handler-interface';

export class Install extends ContainerAware implements IRouteHandler {
    public async handle(req: express.Request, res: express.Response): Promise<void> {
        if (0 < (await this.container.repository.user.count())) {
            return res.redirect('/jeneric/user/sign-in');
        }
    }
}
