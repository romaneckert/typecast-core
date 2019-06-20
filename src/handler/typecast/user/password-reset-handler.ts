import express from 'express';
import { Container } from '../../../container';
import { ContainerAware } from '../../../core/container-aware';
import { Form } from '../../../core/form';
import { IRouteHandler } from '../../../interface/route-handler-interface';
import { LoggerService } from '../../../service/logger-service';
import { UserEmailValidator } from '../../../validator/user/email-validator';

export class TypecastUserPasswordResetHandler extends ContainerAware implements IRouteHandler {
    private logger: LoggerService;

    public constructor(container: Container) {
        super(container);

        this.logger = new LoggerService(container, 'handler', 'typecast-user-password-reset');
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        const form = await new Form(this.container, new UserEmailValidator()).handle(req);

        if (!form.valid) {
            return res.render('typecast/user/password-reset', {
                form,
            });
        }

        const user = await this.container.repository.user.findOne({ where: { email: form.data.email } });

        if (undefined === user) {
            return res.render('typecast/user/password-reset-success', {
                form,
            });
        }

        // generate password token
        const passwordToken = await this.container.service.auth.generatePasswordToken();

        if (undefined !== (await this.container.repository.user.findOne({ where: { passwordToken } }))) {
            this.logger.error('password token already exists');

            form.addError(
                {
                    data_process: 'typecast.error.data_process',
                },
                'user',
            );

            return res.render('typecast/user/password-reset', {
                form,
            });
        }

        user.passwordToken = passwordToken;
        user.passwordTokenCreationDate = new Date();

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

        return res.render('typecast/user/password-reset-success');
    }
}
