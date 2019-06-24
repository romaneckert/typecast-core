import express from 'express';
import { Repository } from 'typeorm';
import { ValidationError } from '../core/validation-error';
import { Route } from '../decorator/route';
import { Log } from '../entity/log';
import { IRoute } from '../interface/route';
import { DatabaseService } from '../service/database';

@Route()
export class IndexRoute implements IRoute {
    public name: string = '/';
    public methods: string[] = ['get', 'post'];
    public path: string = '/';

    private logRepository: Repository<Log>;

    public constructor(database: DatabaseService) {
        this.logRepository = database.getRepository(Log);
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        const errors = [
            new ValidationError('password', '', {
                short: 'typecast.error.password.min_length_8',
                special_chars: 'typecast.error.password.one_special_char_required',
            }),
        ];

        const logs = await this.logRepository.find({ take: 10, order: { date: 'DESC' } });

        return res.render('index', {
            errors,
            logs,
        });
    }
}
