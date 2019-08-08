import express from 'express';
import Route from '../../decorator/route';

@Route({
    name: '/typecast',
    methods: ['get'],
    path: '/typecast',
    roles: ['user'],
    backend: {
        module: {
            mainKey: 'main',
            titleKey: 'start',
        },
    },
})
export default class IndexRoute {
    public async handle(req: express.Request, res: express.Response): Promise<void> {
        return res.render('typecast/index');
    }
}
