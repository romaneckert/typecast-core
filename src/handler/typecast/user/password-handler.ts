import express from 'express';
import { ContainerAware } from '../../../core/container-aware';
import { Form } from '../../../core/form';
import { IRouteHandler } from '../../../interface/route-handler-interface';
import { PasswordValidator } from '../../../validator/password-validator';

export class TypecastUserPasswordHandler extends ContainerAware implements IRouteHandler {
    public async handle(req: express.Request, res: express.Response): Promise<void> {
        const user = await this.container.repository.user.findOne({
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

        const form = await new Form(this.container, new PasswordValidator()).handle(req);

        if (!form.valid) {
            return res.render('typecast/user/password', {
                form,
            });
        }

        // generate password
        user.passwordHash = await this.container.service.auth.hashPassword(form.data.password);

        // add password creation date
        user.passwordHashCreationDate = new Date();

        // remove password token
        user.passwordToken = undefined;

        // remove password token creation date
        user.passwordTokenCreationDate = undefined;

        // save user
        await this.container.repository.user.save(user);

        return res.render('typecast/user/password-success');
    }
}
