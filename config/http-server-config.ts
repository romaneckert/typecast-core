import Config from '../decorator/config';
import IMiddleware from '../interface/middleware';
import AuthMiddleware from '../middleware/auth';
import LocaleMiddleware from '../middleware/locale';
import RolesMiddleware from '../middleware/roles';
import TypecastMiddleware from '../middleware/typecast';
import EnvironmentVariable from '../core/environment-variable';

@Config()
export default class HTTPServerConfig {
    public middlewares: IMiddleware[] = [];

    public constructor(authMiddleware: AuthMiddleware, localeMiddleware: LocaleMiddleware, rolesMiddleware: RolesMiddleware, typecastMiddleware: TypecastMiddleware) {
        this.middlewares.push(authMiddleware);
        this.middlewares.push(localeMiddleware);
        this.middlewares.push(rolesMiddleware);
        this.middlewares.push(typecastMiddleware);
    }

    public get baseUrl(): string {
        return EnvironmentVariable.get('HTTP_SERVER_BASE_URL', 'http://localhost:3000').replace(/\/$/, '');
    }

    public get port(): number {
        return EnvironmentVariable.get('HTTP_SERVER_PORT', 3000);
    }
}
