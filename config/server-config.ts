import { Config } from '../decorator/config';
import { IMiddleware } from '../interface/middleware';
import { AuthMiddleware } from '../middleware/auth';
import { LocaleMiddleware } from '../middleware/locale';
import { RolesMiddleware } from '../middleware/roles';
import { TypecastMiddleware } from '../middleware/typecast';

@Config()
export class ServerConfig {
    public baseUrl: string;
    public port: number = 3000;
    public middlewares: IMiddleware[] = [];

    public constructor(authMiddleware: AuthMiddleware, localeMiddleware: LocaleMiddleware, rolesMiddleware: RolesMiddleware, typecastMiddleware: TypecastMiddleware) {
        // baseUrl
        this.baseUrl = String(process.env.APP_BASE_URL).replace(/\/$/, '');

        this.middlewares.push(authMiddleware);
        this.middlewares.push(localeMiddleware);
        this.middlewares.push(rolesMiddleware);
        this.middlewares.push(typecastMiddleware);
    }

    public validate() {
        // TODO: optimize
        if ('string' !== typeof this.baseUrl || 0 === this.baseUrl.length) {
            throw new Error('baseUrl is empty');
        }
    }
}
