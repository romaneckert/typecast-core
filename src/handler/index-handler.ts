import express from 'express';
import { ContainerAware } from '../core/container-aware';
import { Log } from '../entity/log';
import { IRouteHandler } from '../interface/route-handler-interface';

export class IndexHandler extends ContainerAware implements IRouteHandler {
    public async handle(req: express.Request, res: express.Response): Promise<void> {
        const errors = {
            password: {
                short: 'The password is too short',
                special_chars: 'The password has no special chars',
            },
        };

        const logs = await this.container.entityManager.getRepository(Log).find({ take: 10, order: { date: 'DESC' } });

        return res.render('index', {
            errors,
            logs,
        });
    }
}
