import express from 'express';
import { Repository } from 'typeorm';
import { Form } from '../../../../core/form';
import { Route } from '../../../../decorator/route';
import { User } from '../../../../entity/user';
import { IRoute } from '../../../../interface/route';
import { AuthService } from '../../../../service/auth';
import { DatabaseService } from '../../../../service/database';
import { I18nService } from '../../../../service/i18n';
import { LoggerService } from '../../../../service/logger';
import { UserSignInValidator } from '../../../../validator/user/sign-in-validator';

@Route({
    openapi: {
        post: {
            consumes: ['application/json'],
            description: 'User Sign In',
            parameters: [
                {
                    description: 'user data for sign up',
                    in: 'body',
                    name: 'user',
                    required: true,
                    schema: {
                        properties: {
                            email: {
                                type: 'string',
                            },
                            password: {
                                type: 'string',
                            },
                        },
                        required: ['email', 'password'],
                        type: 'object',
                    },
                },
            ],
            produces: ['application/json'],
            responses: {
                '200': {
                    description: 'response',
                },
            },
        },
    },
})
export class SignInRoute implements IRoute {
    public name: string = '/api/user/sign-in';
    public methods: string[] = ['get', 'post'];
    public path: string = '/api/user/sign-in';

    private auth: AuthService;
    private logger: LoggerService;
    private i18n: I18nService;
    private userRepository: Repository<User>;

    public constructor(auth: AuthService, database: DatabaseService, logger: LoggerService, i18n: I18nService) {
        this.auth = auth;
        this.logger = logger;
        this.i18n = i18n;
        this.userRepository = database.getRepository(User);
    }

    public async handle(req: express.Request, res: express.Response): Promise<express.Response> {
        const form = await new Form(new UserSignInValidator()).handle(req);

        if (!form.submitted) {
            form.addError(
                {
                    data_process: 'typecast.error.data_process',
                },
                'user',
            );
        }

        if (!form.valid) {
            return res.status(500).json({
                errors: this.i18n.translateErrors(res.locals.locale, form.errors),
            });
        }

        const user = await this.userRepository.findOne({ where: { email: form.data.email } });

        if (undefined === user) {
            form.addError(
                {
                    incorrect_username_or_password: 'typecast.error.user.incorrect_username_or_password',
                },
                'user',
            );

            return res.status(500).json({
                errors: this.i18n.translateErrors(res.locals.locale, form.errors),
            });
        }

        if (!(await this.auth.verifyPassword(form.data.password, user.passwordHash))) {
            form.addError(
                {
                    incorrect_username_or_password: 'typecast.error.user.incorrect_username_or_password',
                },
                'user',
            );

            return res.status(500).json({
                errors: this.i18n.translateErrors(res.locals.locale, form.errors),
            });
        }

        const token = await this.auth.generateJsonWebToken(user);

        if (undefined === token) {
            form.addError(
                {
                    incorrect_username_or_password: 'typecast.error.data_process',
                },
                'user',
            );

            return res.status(500).json({
                errors: this.i18n.translateErrors(res.locals.locale, form.errors),
            });
        }

        this.logger.info(`user with id ${user.id} signed in via json request`);

        return res.json({
            token,
        });
    }
}
