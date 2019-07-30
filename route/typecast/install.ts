import express from 'express';
import { Repository } from 'typeorm';
import Form from '../../core/form';
import { Route } from '../../decorator/route';
import User from '../../entity/user';
import { IRoute } from '../../interface/route';
import { AuthService } from '../../service/auth';
import { DatabaseService } from '../../service/database';
import { I18nService } from '../../service/i18n';
import { MailService } from '../../service/mail';
import { HTTPServerService } from '../../service/http-server';
import { EmailValidator } from '../../validator/email-validator';

@Route()
export class InstallRoute implements IRoute {
    public name: string = '/typecast/install';
    public methods: string[] = ['get', 'post'];
    public path: string = '/typecast/install';

    private auth: AuthService;
    private i18n: I18nService;
    private mail: MailService;
    private server: HTTPServerService;
    private userRepository: Repository<User>;

    public constructor(auth: AuthService, database: DatabaseService, i18n: I18nService, mail: MailService, server: HTTPServerService) {
        this.auth = auth;
        this.i18n = i18n;
        this.mail = mail;
        this.server = server;
        this.userRepository = database.getRepository(User);
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        // check if some users in db exists
        if (0 < (await this.userRepository.count())) {
            return res.redirect('/typecast/user/sign-in');
        }

        const form = await new Form(new EmailValidator()).handle(req);

        if (!form.valid) {
            return res.render('typecast/install/user-creation', {
                form,
            });
        }

        // check if user with email already exists
        if (undefined !== (await this.userRepository.findOne({ where: { email: form.data.email } }))) {
            return res.redirect('/typecast/install');
        }

        // generate password token
        const passwordToken = await this.auth.generatePasswordToken();

        if (undefined !== (await this.userRepository.findOne({ where: { passwordToken } }))) {
            throw new Error('user with password token already exists');
        }

        const user = new User();
        user.email = form.data.email;
        user.passwordToken = passwordToken;
        user.passwordTokenCreationDate = new Date();
        user.roles = ['admin', 'user'];

        await this.userRepository.save(user);

        // send email with confirm token
        const html = await this.server.render('typecast/user/email/set-password', { user });
        const subject = this.i18n.translate(res.locals.locale, 'application.title') + ' | ' + this.i18n.translate(res.locals.locale, 'typecast.user.email.password.subject');

        try {
            await this.mail.send({
                html,
                subject,
                to: user.email,
            });
        } catch (err) {
            await this.userRepository.remove(user);

            await form.error('user', 'send_email', 'typecast.error.send_email');

            return res.render('typecast/install/user-creation', {
                form,
            });
        }

        return res.render('typecast/install/user-creation-success');
    }
}
