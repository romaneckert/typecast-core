import express from 'express';
import { Repository } from 'typeorm';
import { Route } from '../../../../decorator/route';
import Log from '../../../../entity/log';
import { IRoute } from '../../../../interface/route';
import { DatabaseService } from '../../../../service/database';

@Route()
export class ReportRoute implements IRoute {
    public name: string = '/typecast/admin/system/report';
    public methods: string[] = ['get'];
    public path: string = '/typecast/admin/system/report';
    public roles: string[] = ['user', 'admin'];
    public backendModuleMainKey: string = 'admin';
    public backendModuleSubKey: string = 'system';
    public backendModuleTitleKey: string = 'report';
    public disabled: boolean = true;

    private logRepository: Repository<Log>;

    public constructor(database: DatabaseService) {
        this.logRepository = database.getRepository(Log);
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        return res.render('typecast/admin/system/report');
    }
}
