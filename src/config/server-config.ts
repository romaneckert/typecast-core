import { Config } from '../decorator/config';
import { IConfig } from '../interface/config';
import { IMiddleware } from '../interface/middleware';
import { AuthMiddleware } from '../middleware/auth';
import { LocaleMiddleware } from '../middleware/locale';
import { RolesMiddleware } from '../middleware/roles';
import { TypecastMiddleware } from '../middleware/typecast';

@Config()
export class ServerConfig implements IConfig {
    public port: number = 3000;
    public middlewares: IMiddleware[] = [];

    public constructor(authMiddleware: AuthMiddleware, localeMiddleware: LocaleMiddleware, rolesMiddleware: RolesMiddleware, typecastMiddleware: TypecastMiddleware) {
        this.middlewares.push(authMiddleware);
        this.middlewares.push(localeMiddleware);
        this.middlewares.push(rolesMiddleware);
        this.middlewares.push(typecastMiddleware);
    }

    public validate() {
        return;
    }
}
