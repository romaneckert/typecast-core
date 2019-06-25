import express from 'express';
import { Container } from '../core/container';
import { Middleware } from '../decorator/middleware';
import { IMiddleware } from '../interface/middleware';

@Middleware()
export class TypecastMiddleware implements IMiddleware {
    private typecastConfig: { [key: string]: any };

    public async handle(req: express.Request, res: express.Response, next: () => void) {
        // check route.path from request
        if ('object' !== typeof req.route || 'string' !== typeof req.route.path) {
            throw new Error('can not get route.path from request');
        }

        if (0 !== req.route.path.indexOf('/typecast')) {
            return next();
        }

        if (undefined !== this.typecastConfig) {
            res.locals.typecast = this.typecastConfig;
            return next();
        }

        this.typecastConfig = {
            module: {},
        };

        for (const [key, route] of await Object.entries(await Container.getRoutes())) {
            if (undefined === route.backendModuleMainKey || undefined === route.backendModuleTitleKey) {
                continue;
            }

            const routeData = {
                key: route.backendModuleTitleKey,
                path: route.path,
            };

            if (undefined === this.typecastConfig.module[route.backendModuleMainKey]) {
                this.typecastConfig.module[route.backendModuleMainKey] = {
                    children: {},
                    key: route.backendModuleMainKey,
                };
            }

            if (undefined !== route.backendModuleSubKey) {
                if (undefined === this.typecastConfig.module[route.backendModuleMainKey].children[route.backendModuleSubKey]) {
                    this.typecastConfig.module[route.backendModuleMainKey].children[route.backendModuleSubKey] = {
                        children: {},
                        key: route.backendModuleSubKey,
                    };
                    this.typecastConfig.module[route.backendModuleMainKey].children[route.backendModuleSubKey].children[routeData.key] = routeData;
                }
            } else {
                this.typecastConfig.module[route.backendModuleMainKey].children[routeData.key] = routeData;
            }
        }

        res.locals.typecast = this.typecastConfig;

        return next();
    }
}
