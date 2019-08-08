import express from 'express';
import Route from '../../../decorator/route';

@Route({
    name: '/typecast/admin/design',
    methods: ['get'],
    roles: ['admin'],
    path: '/typecast/admin/design',
    backend: {
        module: {
            mainKey: 'admin',
            titleKey: 'design',
        },
    },
})
export default class DesignRoute {
    public async handle(req: express.Request, res: express.Response): Promise<void> {
        return res.render('typecast/admin/design');
    }
}
