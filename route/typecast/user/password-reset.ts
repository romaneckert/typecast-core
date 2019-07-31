import express from 'express';
import { Repository } from 'typeorm';
import Form from '../../../core/form';
import { Route } from '../../../decorator/route';
import User from '../../../entity/user';
import IRoute from '../../../interface/route';
import AuthService from '../../../service/auth';
import DatabaseService from '../../../service/database';
import I18nService from '../../../service/i18n';
import LoggerService from '../../../service/logger';
import MailService from '../../../service/mail';
import HTTPServerService from '../../../service/http-server';
import EmailValidator from '../../../validator/email-validator';

@Route()
export class PasswordResetRoute implements IRoute {
    public name: string = '/typecast/user/password-reset';
    public methods: string[] = ['get', 'post'];
    public path: string = '/typecast/user/password-reset';

    private auth: AuthService;
    private i18n: I18nService;
    private logger: LoggerService;
    private mail: MailService;
    private server: HTTPServerService;
    private userRepository: Repository<User>;

    public constructor(auth: AuthService, database: DatabaseService, i18n: I18nService, logger: LoggerService, mail: MailService, server: HTTPServerService) {
        this.auth = auth;
        this.i18n = i18n;
        this.logger = logger;
        this.mail = mail;
        this.server = server;
        this.userRepository = database.getRepository(User);
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        const form = await new Form(new EmailValidator()).handle(req);

        if (!form.valid) {
            return res.render('typecast/user/password-reset', {
                form,
            });
        }

        const user = await this.userRepository.findOne({ where: { email: form.data.email } });

        if (undefined === user) {
            return res.render('typecast/user/password-reset-success', {
                form,
            });
        }

        // generate password token
        const passwordToken = await this.auth.generatePasswordToken();

        if (undefined !== (await this.userRepository.findOne({ where: { passwordToken } }))) {
            this.logger.error('password token already exists');

            await form.error('user');

            return res.render('typecast/user/password-reset', {
                form,
            });
        }

        user.passwordToken = passwordToken;
        user.passwordTokenCreationDate = new Date();

        await this.userRepository.save(user);

        // send email with confirm token
        const html = await this.server.render('typecast/user/email/set-password', { user });
        const subject = this.i18n.translate(res.locals.locale, 'application.title') + ' | ' + this.i18n.translate(res.locals.locale, 'typecast.user.email.password.subject');

        await this.mail.send({
            html,
            subject,
            to: user.email,
        });

        return res.render('typecast/user/password-reset-success');
    }
}
