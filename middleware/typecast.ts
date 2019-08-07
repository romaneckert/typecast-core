import express from 'express';
import Container from '../core/container';
import Middleware from '../decorator/middleware';
import IMiddleware from '../interface/middleware';

@Middleware()
export default class TypecastMiddleware implements IMiddleware {
    private typecastConfig: { [key: string]: any } = {
        module: undefined,
        currentRoutePath: undefined,
    };

    public async handle(req: express.Request, res: express.Response, next: () => void) {
        // check route.path from request
        if ('object' !== typeof req.route || 'string' !== typeof req.route.path) {
            throw new Error('can not get route.path from request');
        }

        const typecastConfig: { [key: string]: any } = {
            module: {},
            currentRoutePath: req.route.path,
        };

        if (0 !== req.route.path.indexOf('/typecast')) {
            return next();
        }

        for (const route of await Object.values(await Container.getRoutes())) {
            if (undefined === route.backendModuleMainKey || undefined === route.backendModuleTitleKey || true === route.disabled) {
                continue;
            }

            if (undefined !== route.roles) {
                if (undefined === res.locals.user || undefined === res.locals.user.roles) {
                    continue;
                }

                let access = false;

                for (const routeRole of route.roles) {
                    for (const userRole of res.locals.user.roles) {
                        if (routeRole === userRole) {
                            access = true;
                            break;
                        }
                    }

                    if (access) {
                        break;
                    }
                }

                if (!access) {
                    continue;
                }
            }
            const routeData = {
                key: route.backendModuleTitleKey,
                path: route.path,
            };

            if (undefined === typecastConfig.module[route.backendModuleMainKey]) {
                typecastConfig.module[route.backendModuleMainKey] = {
                    children: {},
                    key: route.backendModuleMainKey,
                };
            }

            if (undefined !== route.backendModuleSubKey) {
                if (undefined === typecastConfig.module[route.backendModuleMainKey].children[route.backendModuleSubKey]) {
                    typecastConfig.module[route.backendModuleMainKey].children[route.backendModuleSubKey] = {
                        children: {},
                        key: route.backendModuleSubKey,
                    };
                    typecastConfig.module[route.backendModuleMainKey].children[route.backendModuleSubKey].children[routeData.key] = routeData;
                }
            } else {
                typecastConfig.module[route.backendModuleMainKey].children[routeData.key] = routeData;
            }
        }

        const orderedModules: { [key: string]: any } = {};
        Object.keys(typecastConfig.module)
            .sort()
            .reverse()
            .forEach(key => {
                orderedModules[key] = typecastConfig.module[key];
            });

        typecastConfig.module = orderedModules;

        res.locals.typecast = typecastConfig;

        return next();
    }
}
