import * as crypto from 'crypto';
import { Config } from '../decorator/config';
import { IConfig } from '../interface/config';

@Config()
export class AuthConfig implements IConfig {
    public redirectPath: string = '/typecast/user/sign-in';
    public secret: string;
    public tokenCookieName: string = '_t';
    public tokenExpiresIn: number = 600;

    constructor() {
        if (undefined === process.env.APP_SECRET) {
            this.secret = '';
        } else {
            this.secret = process.env.APP_SECRET;
        }
    }

    // TODO: optimize
    public validate() {
        if ('string' !== typeof this.secret || 10 > this.secret.length) {
            const exampleSecret = crypto.randomBytes(32).toString('hex');

            throw new Error(`secret not set or not valid - have to be string, minimum length 10 - example: ${exampleSecret}`);
        }
    }
}
