import express from 'express';
import { Form } from '../../../core/form';
import { Route } from '../../../decorator/route';
import { IRouteHandler } from '../../../interface/router-handler';
import { UserSignInValidator } from '../../../validator/user/sign-in-validator';

@Route()
export class TypecastUserSignInRoute implements IRouteHandler {
    public name: '/typecast/user/sign-in';
    public methods: ['get'];
    public path: '/typecast/user/sign-in';

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        /*
        const form = await new Form(this.container, new UserSignInValidator()).handle(req);

        if (!form.valid) {
            return res.render('typecast/user/sign-in', {
                form,
            });
        }

        const user = await this.container.repository.user.findOne({ where: { email: form.data.email } });

        if (undefined === user) {
            form.addError(
                {
                    incorrect_username_or_password: 'typecast.error.user.incorrect_username_or_password',
                },
                'user',
            );

            return res.render('typecast/user/sign-in', {
                form,
            });
        }

        if (await this.container.service.auth.verifyPassword(form.data.password, user.passwordHash)) {
            form.addError(
                {
                    incorrect_username_or_password: 'typecast.error.user.incorrect_username_or_password',
                },
                'user',
            );

            return res.render('typecast/user/sign-in', {
                form,
            });
        }

        if (!this.container.service.auth.signIn(req, res, user)) {
            form.addError(
                {
                    incorrect_username_or_password: 'typecast.error.data_process',
                },
                'user',
            );

            return res.render('typecast/user/sign-in', {
                form,
            });
        }

        return res.redirect('/typecast');
        */
    }
}
