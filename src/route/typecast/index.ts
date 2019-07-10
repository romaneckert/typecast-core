import express from 'express';
import { Repository } from 'typeorm';
import { Route } from '../../decorator/route';
import { Log } from '../../entity/log';
import { IRoute } from '../../interface/route';
import { DatabaseService } from '../../service/database';

@Route()
export class IndexRoute implements IRoute {
    public name: string = '/typecast';
    public methods: string[] = ['get'];
    public path: string = '/typecast';
    public roles: string[] = ['user'];
    public backendModuleMainKey: string = 'main';
    public backendModuleTitleKey: string = 'start';

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        return res.render('typecast/index');
    }
}
