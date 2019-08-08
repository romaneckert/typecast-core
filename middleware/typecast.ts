import express from 'express';
import Container from '../core/container';
import Middleware from '../decorator/middleware';
import IMiddleware from '../interface/middleware';

@Middleware()
export default class TypecastMiddleware implements IMiddleware {
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
            if (
                undefined === route.__options.backend ||
                undefined === route.__options.backend.module ||
                undefined === route.__options.backend.module.mainKey ||
                undefined === route.__options.backend.module.titleKey ||
                true === route.disabled
            ) {
                continue;
            }

            const mainKey = route.__options.backend.module.mainKey;
            const subKey = route.__options.backend.module.subKey;
            const titleKey = route.__options.backend.module.titleKey;

            if (undefined !== route.__options.roles) {
                if (undefined === res.locals.user || undefined === res.locals.user.roles) {
                    continue;
                }

                let access = false;

                for (const routeRole of route.__options.roles) {
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
                key: titleKey,
                path: route.__options.path,
            };

            if (undefined === typecastConfig.module[mainKey]) {
                typecastConfig.module[mainKey] = {
                    children: {},
                    key: mainKey,
                };
            }

            if (undefined !== subKey) {
                if (undefined === typecastConfig.module[mainKey].children[subKey]) {
                    typecastConfig.module[mainKey].children[subKey] = {
                        children: {},
                        key: subKey,
                    };
                }
                typecastConfig.module[mainKey].children[subKey].children[routeData.key] = routeData;
            } else {
                typecastConfig.module[mainKey].children[routeData.key] = routeData;
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
