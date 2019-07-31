import express from 'express';
import Route from '../../../decorator/route';
import IRoute from '../../../interface/route';
import AuthService from '../../../service/auth';

@Route()
export class SignOutRoute implements IRoute {
    public name: string = '/typecast/user/sign-out';
    public methods: string[] = ['get'];
    public path: string = '/typecast/user/sign-out';

    private auth: AuthService;

    public constructor(auth: AuthService) {
        this.auth = auth;
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        this.auth.signOut(req, res);

        return res.redirect('/typecast/user/sign-in');
    }
}
