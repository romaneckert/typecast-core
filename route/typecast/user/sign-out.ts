import express from 'express';
import Route from '../../../decorator/route';
import AuthService from '../../../service/auth';

@Route({
    name: '/typecast/user/sign-out',
    methods: ['get'],
    path: '/typecast/user/sign-out',
})
export default class SignOutRoute {
    private auth: AuthService;

    public constructor(auth: AuthService) {
        this.auth = auth;
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        this.auth.signOut(req, res);

        return res.redirect('/typecast/user/sign-in');
    }
}
