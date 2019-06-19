import express from 'express';
import { ContainerAware } from '../core/container-aware';
import { ValidationError } from '../core/validation-error';
import { Log } from '../entity/log';
import { IRouteHandler } from '../interface/route-handler-interface';

export class IndexHandler extends ContainerAware implements IRouteHandler {
    public async handle(req: express.Request, res: express.Response): Promise<void> {
        const errors = [
            new ValidationError('password', '', {
                short: 'typecast.error.password.min_length_8',
                special_chars: 'typecast.error.password.one_special_char_required',
            }),
        ];

        const logs = await this.container.entityManager.getRepository(Log).find({ take: 10, order: { date: 'DESC' } });

        return res.render('index', {
            errors,
            logs,
        });
    }
}
