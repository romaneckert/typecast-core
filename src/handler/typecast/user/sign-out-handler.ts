import express from 'express';
import { ContainerAware } from '../../../core/container-aware';
import { IRouteHandler } from '../../../interface/route-handler-interface';

export class TypecastUserSignOutHandler extends ContainerAware implements IRouteHandler {
    public async handle(req: express.Request, res: express.Response): Promise<void> {
        this.container.service.auth.signOut(req, res);

        return res.redirect('/typecast/user/sign-in');
    }
}
