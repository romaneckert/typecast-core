import express from 'express';
import { ContainerAware } from '../../core/container-aware';
import { Form } from '../../core/form';
import { User } from '../../entity/user';
import { IRouteHandler } from '../../interface/route-handler-interface';
import { UserEmailValidator } from '../../validator/user/email-validator';

export class TypecastInstallHandler extends ContainerAware implements IRouteHandler {
    public async handle(req: express.Request, res: express.Response): Promise<void> {
        // check if some users in db exists
        if (0 < (await this.container.repository.user.count())) {
            return res.redirect('/typecast/user/sign-in');
        }

        const form = await new Form(this.container, new UserEmailValidator()).handle(req);

        if (!form.valid) {
            return res.render('typecast/install/user-creation', {
                form,
            });
        }

        // check if user with email already exists
        if (undefined !== (await this.container.repository.user.findOne({ where: { email: form.data.email } }))) {
            return res.redirect('/typecast/install');
        }

        // generate password token
        const passwordToken = await this.container.service.auth.generatePasswordToken();

        if (undefined !== (await this.container.repository.user.findOne({ where: { passwordToken } }))) {
            throw new Error('user with password token already exists');
        }

        const user = new User();
        user.email = form.data.email;
        user.passwordToken = passwordToken;
        user.passwordTokenCreationDate = new Date();
        user.roles = ['admin', 'user'];

        await this.container.repository.user.save(user);

        // send email with confirm token
        const html = await this.container.service.server.render('typecast/user/email/set-password', { user });
        const subject =
            this.container.service.i18n.translate(res.locals.locale, 'application.title') +
            ' | ' +
            this.container.service.i18n.translate(res.locals.locale, 'typecast.user.email.password.subject');

        await this.container.service.mail.send({
            html,
            subject,
            to: user.email,
        });

        return res.render('typecast/install/user-creation-success');
    }
}
