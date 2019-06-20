import express from 'express';
import { ContainerAware } from '../../../core/container-aware';
import { Form } from '../../../core/form';
import { IRouteHandler } from '../../../interface/route-handler-interface';
import { UserSignInValidator } from '../../../validator/user/sign-in-validator';

export class TypecastUserSignInHandler extends ContainerAware implements IRouteHandler {
    public async handle(req: express.Request, res: express.Response): Promise<void> {
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
    }
}
