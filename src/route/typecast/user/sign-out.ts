import express from 'express';
import { Route } from '../../../decorator/route';
import { IRoute } from '../../../interface/route';
import { AuthService } from '../../../service/auth';

@Route()
export class TypecastUserSignOutRoute implements IRoute {
    public name: '/typecast/user/sign-out';
    public methods: ['get'];
    public path: '/typecast/user/sign-out';

    private auth: AuthService;

    public constructor(auth: AuthService) {
        this.auth = auth;
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        this.auth.signOut(req, res);

        return res.redirect('/typecast/user/sign-in');
    }
}
