import express from 'express';
import Route from '../../../../decorator/route';

@Route({
    name: '/typecast/admin/system/config',
    methods: ['get'],
    roles: ['admin'],
    path: '/typecast/admin/system/config',
    backend: {
        module: {
            mainKey: 'admin',
            subKey: 'system',
            titleKey: 'config',
        },
    },
})
export default class ConfigRoute {
    public async handle(req: express.Request, res: express.Response): Promise<void> {
        return res.render('typecast/admin/system/config');
    }
}
