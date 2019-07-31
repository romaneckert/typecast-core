import express from 'express';
import AuthConfig from '../config/auth-config';
import Container from '../core/container';
import { Middleware } from '../decorator/middleware';
import { IMiddleware } from '../interface/middleware';
import HTTPServerService from '../service/http-server';

@Middleware()
export default class RolesMiddleware implements IMiddleware {
    private routePathRoleMap: { [key: string]: string[] };
    private authConfig: AuthConfig;

    public constructor(authConfig: AuthConfig) {
        this.authConfig = authConfig;
    }

    public async handle(req: express.Request, res: express.Response, next: () => void) {
        if (undefined === this.routePathRoleMap) {
            await this.initRoutePathRoleMap();
        }

        // check route.path from request
        if ('object' !== typeof req.route || 'string' !== typeof req.route.path) {
            throw new Error('can not get route.path from request');
        }

        // check if route has roles
        const routeRoles = this.routePathRoleMap[req.route.path];

        if (undefined === routeRoles) {
            throw new Error('can not get roles');
        }

        if (0 === routeRoles.length) {
            return next();
        }

        // check if user has authenticated
        if ('object' !== typeof res.locals.user) {
            return res.redirect(this.authConfig.redirectPath);
        }

        // check if one role in user roles match route roles
        for (const role of res.locals.user.roles) {
            if (routeRoles.indexOf(role) > -1) {
                return next();
            }
        }

        // output json if header context type set to application/json
        if (req.headers['content-type'] === 'application/json') {
            return res.status(403).json();
        }

        // redirect to redirect path / maybe sign in route
        return res.redirect(this.authConfig.redirectPath);
    }

    private async initRoutePathRoleMap() {
        this.routePathRoleMap = {};

        const server = await Container.get<HTTPServerService>(HTTPServerService);

        for (const [key, route] of Object.entries(server.routes)) {
            let roles: string[] = [];

            if (undefined !== route.roles) {
                roles = route.roles;
            }

            this.routePathRoleMap[route.path] = roles;
        }
    }
}
