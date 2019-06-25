import * as crypto from 'crypto';
import express from 'express';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { AuthConfig } from '../config/auth-config';
import { Service } from '../decorator/service';
import { User } from '../entity/user';
import { DatabaseService } from './database';

@Service()
export class AuthService {
    private config: AuthConfig;
    private userRepository: Repository<User>;

    public constructor(config: AuthConfig, database: DatabaseService) {
        this.config = config;
        this.userRepository = database.getRepository(User);
    }

    public async start(): Promise<void> {
        // nothing todo
    }

    public async hashPassword(plainPassword: string): Promise<string> {
        const hmac = crypto.createHmac('sha512', this.config.secret);
        hmac.update(plainPassword);
        return hmac.digest('hex');
    }

    public async verifyPassword(plainPassword: string, hashedPassword: string) {
        return hashedPassword === (await this.hashPassword(plainPassword));
    }

    public async generatePasswordToken(): Promise<string> {
        return crypto.randomBytes(32).toString('hex');
    }

    public async generateJsonWebToken(user: User): Promise<string | undefined> {
        // validate user
        if ('object' !== typeof user || null === user) {
            return undefined;
        }

        // validate user email
        if ('string' !== typeof user.email || 0 === user.email.length) {
            return undefined;
        }

        // validate user roles
        if ('object' !== typeof user.roles || 0 === user.roles.length) {
            return undefined;
        }

        // generate json web token
        return jwt.sign(
            {
                user: {
                    email: user.email,
                    roles: user.roles,
                },
            },
            this.config.secret,
            {
                expiresIn: this.config.tokenExpiresIn,
            },
        );
    }

    public async signIn(res: express.Response, user: User): Promise<boolean> {
        const token = this.generateJsonWebToken(user);

        if (undefined === token) {
            return false;
        }

        // add json web token cookie
        res.cookie(this.config.tokenCookieName, token, {
            expires: new Date(Date.now() + this.config.tokenExpiresIn * 1000),
            httpOnly: true,
            sameSite: 'Strict',
            // TODO: set secure cookie
            // secure: true,
        });

        // add user to req and res
        res.locals.user = user;

        return true;
    }

    public async signOut(req: express.Request, res: express.Response) {
        // remove user from request and response
        res.locals.user = null;

        // clear token cookie
        res.clearCookie(this.config.tokenCookieName);
    }

    public async verify(req: express.Request, res: express.Response): Promise<User | undefined> {
        // validate req
        if ('object' !== typeof req || null === req) {
            return undefined;
        }

        // validate cookies
        if ('object' !== typeof req.cookies || null === req.cookies) {
            return undefined;
        }

        // validate json web token cookie
        if ('string' !== typeof req.cookies[this.config.tokenCookieName] || 0 === req.cookies[this.config.tokenCookieName].length) {
            return undefined;
        }

        // verify token
        let data;

        try {
            data = Object(jwt.verify(req.cookies[this.config.tokenCookieName], this.config.secret));
        } catch (err) {
            return undefined;
        }

        if (undefined === data) {
            return data;
        }

        // validate user data
        if ('object' !== typeof data.user || null === data.user) {
            return undefined;
        }

        // validate user email
        if ('string' !== typeof data.user.email || 0 === data.user.email.length) {
            return undefined;
        }

        // validate user roles
        if ('object' !== typeof data.user.roles || 0 === data.user.roles.length) {
            return undefined;
        }

        // get user from db
        const user = await this.userRepository.findOne({ email: data.user.email });

        if (undefined === user) {
            return undefined;
        }

        // sign in user to refresh the json web token
        this.signIn(res, user);

        return user;
    }
}
