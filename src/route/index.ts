import express from 'express';
import { ValidationError } from '../core/validation-error';
import { Route } from '../decorator/route';
import { IRoute } from '../interface/route';

@Route()
export class IndexRoute implements IRoute {
    public name: '/';
    public methods: ['get'];
    public path: '/';

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        /*
        const errors = [
            new ValidationError('password', '', {
                short: 'typecast.error.password.min_length_8',
                special_chars: 'typecast.error.password.one_special_char_required',
            }),
        ];

        const logs = await this.container.repository.log.find({ take: 10, order: { date: 'DESC' } });

        return res.render('index', {
            errors,
            logs,
        });*/
    }
}
