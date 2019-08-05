import express from 'express';
import IRoute from '../../../interface/route';
import Route from '../../../decorator/route';

@Route()
export default class DesignRoute implements IRoute {
    public name: string = '/typecast/admin/design';
    public methods: string[] = ['get'];
    public path: string = '/typecast/admin/design';
    public roles: string[] = ['admin'];
    public backendModuleMainKey: string = 'admin';
    public backendModuleTitleKey: string = 'design';

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        return res.render('typecast/admin/design');
    }
}
