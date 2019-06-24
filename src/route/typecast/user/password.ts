import express from 'express';
import { Repository } from 'typeorm';
import { Form } from '../../../core/form';
import { Route } from '../../../decorator/route';
import { User } from '../../../entity/user';
import { IRoute } from '../../../interface/route';
import { AuthService } from '../../../service/auth';
import { DatabaseService } from '../../../service/database';
import { PasswordValidator } from '../../../validator/password-validator';

@Route()
export class TypecastUserPasswordRoute implements IRoute {
    public name: string = '/typecast/user/password';
    public methods: string[] = ['get', 'post'];
    public path: string = '/typecast/user/password/:passwordToken';

    private auth: AuthService;
    private userRepository: Repository<User>;

    public constructor(auth: AuthService, database: DatabaseService) {
        this.auth = auth;
        this.userRepository = database.getRepository(User);
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        const user = await this.userRepository.findOne({
            where: { passwordToken: req.params.passwordToken },
        });

        // return password token expired after 24h
        if (
            undefined === user ||
            undefined === user.passwordTokenCreationDate ||
            new Date().valueOf() - user.passwordTokenCreationDate.valueOf() > 24 * 60 * 60 * 1000
        ) {
            return res.render('typecast/user/password-token-expired');
        }

        const form = await new Form(new PasswordValidator()).handle(req);

        if (!form.valid) {
            return res.render('typecast/user/password', {
                form,
            });
        }

        // generate password
        user.passwordHash = await this.auth.hashPassword(form.data.password);

        // add password creation date
        user.passwordHashCreationDate = new Date();

        // remove password token
        user.passwordToken = undefined;

        // remove password token creation date
        user.passwordTokenCreationDate = undefined;

        // save user
        await this.userRepository.save(user);

        return res.render('typecast/user/password-success');
    }
}
