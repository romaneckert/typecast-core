import express from 'express';
import Route from '../../decorator/route';
import IRoute from '../../interface/route';

@Route()
export default class IndexRoute implements IRoute {
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
