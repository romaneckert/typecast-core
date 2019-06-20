import express from 'express';
import { ContainerAware } from '../../../core/container-aware';
import { User } from '../../../entity/user';
import { SignInForm } from '../../../form/sign-in-form';
import { IRouteHandler } from '../../../interface/route-handler-interface';

export class SignInHandler extends ContainerAware implements IRouteHandler {
    public async handle(req: express.Request, res: express.Response): Promise<void> {
        const form = new SignInForm(this.container);

        await form.handle(req.body);

        if (!form.valid) {
            return res.render('typecast/user/sign-in', {
                form,
            });
        }

        const user = await this.container.repository.user.findOne({ where: { email: form.email } });

        if (undefined === user) {
            form.addError(
                {
                    incorrect_username_or_password: 'jeneric.error.user.incorrect_username_or_password',
                },
                'user',
            );

            return res.render('typecast/user/sign-in', {
                form,
            });
        }
    }
}
