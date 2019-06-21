import * as crypto from 'crypto';
import { Component } from '../core/component';
import { IAuthConfig } from '../interface/config/auth-config-interface';

@Component('config', 'auth')
export class AuthConfig implements IAuthConfig {
    public tokenExpiresIn: number = 600;
    public tokenCookieName: string = '_t';
    public secret: string;

    constructor() {
        if (undefined === process.env.APP_SECRET) {
            this.secret = '';
        } else {
            this.secret = process.env.APP_SECRET;
        }
    }

    public validate() {
        if ('string' !== typeof this.secret || 10 > this.secret.length) {
            const exampleSecret = crypto.randomBytes(32).toString('hex');

            throw new Error(
                `secret not set or not valid - have to be string, minimum length 10 - example: ${exampleSecret}`,
            );
        }
    }
}
