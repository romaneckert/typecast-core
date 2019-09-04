import express from 'express';
import { Repository } from 'typeorm';
import Form from '../../../core/form';
import Route from '../../../decorator/route';
import User from '../../../entity/user';
import AuthService from '../../../service/auth';
import DatabaseService from '../../../service/database';
import LoggerService from '../../../service/logger';
import UserSignInValidator from '../../../validator/user/sign-in-validator';

@Route({
    name: '/typecast/user/sign-in',
    methods: ['get', 'post'],
    path: '/typecast/user/sign-in',
})
export default class SignInRoute {
    private auth: AuthService;
    private logger: LoggerService;
    private userRepository: Repository<User>;

    public constructor(auth: AuthService, database: DatabaseService, logger: LoggerService) {
        this.auth = auth;
        this.logger = logger;
        this.userRepository = database.getRepository(User);
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        // check if some users in db exists
        if (0 === (await this.userRepository.count())) {
            return res.redirect('/typecast/install');
        }

        const form = await new Form(new UserSignInValidator()).handle(req);

        if (!form.valid) {
            return res.render('typecast/user/sign-in', {
                form,
            });
        }

        const user = await this.userRepository.findOne({ where: { email: form.data.email } });

        if (undefined === user || null === user.passwordHash || !(await this.auth.verifyPassword(form.data.password, user.passwordHash))) {
            await form.error('user', 'incorrect_username_or_password', 'typecast.error.user.incorrect_username_or_password');

            return res.render('typecast/user/sign-in', {
                form,
            });
        }

        if (!(await this.auth.signIn(res, user))) {
            await form.error('user');

            return res.render('typecast/user/sign-in', {
                form,
            });
        }

        this.logger.info(`user with id ${user.id} signed in`);

        return res.redirect('/typecast');
    }
}
