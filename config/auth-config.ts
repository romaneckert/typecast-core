import * as crypto from 'crypto';
import { Config } from '../decorator/config';
import EnvironmentVariable from '../core/environment-variable';
import { EnvironmentVariableError } from '../error/environment-variable';

@Config()
export class AuthConfig {
    public redirectPath: string = '/typecast/user/sign-in';
    public tokenCookieName: string = '_t';
    public tokenExpiresIn: number = 600;

    public get secret(): string {
        const example = crypto.randomBytes(32).toString('hex');
        const secret = EnvironmentVariable.get('APP_SECRET', example);

        if (10 > secret.length) {
            throw new EnvironmentVariableError('APP_SECRET', example);
        }

        return secret;
    }
}
