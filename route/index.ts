import express from 'express';
import { Repository } from 'typeorm';
import Form from '../core/form';
import Route from '../decorator/route';
import Log from '../entity/log';
import DatabaseService from '../service/database';
import UserSignInValidator from '../validator/user/sign-in-validator';

@Route({
    name: '/',
    methods: ['get'],
    path: '/',
})
export default class IndexRoute {
    private logRepository: Repository<Log>;

    public constructor(database: DatabaseService) {
        this.logRepository = database.getRepository(Log);
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        const form = await new Form(new UserSignInValidator()).handle(req);
        const logs = await this.logRepository.find({ take: 10, order: { date: 'DESC' } });

        await form.validate();

        return res.render('index', {
            form,
            logs,
        });
    }
}
