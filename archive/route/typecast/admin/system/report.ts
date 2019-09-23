import express from 'express';
import { Repository } from 'typeorm';
import Route from '../../../../decorator/route';
import Log from '../../../../entity/log';
import DatabaseService from '../../../../service/database';

@Route({
    name: '/typecast/admin/system/report',
    methods: ['get'],
    roles: ['admin'],
    path: '/typecast/admin/system/report',
    backend: {
        module: {
            mainKey: 'admin',
            subKey: 'system',
            titleKey: 'report',
        },
    },
})
export default class ReportRoute {
    private logRepository: Repository<Log>;

    public constructor(database: DatabaseService) {
        this.logRepository = database.getRepository(Log);
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        return res.render('typecast/admin/system/report');
    }
}
