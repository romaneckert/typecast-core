import express from 'express';
import * as url from 'url';
import { ApplicationConfig } from '../../config/application-config';
import { Container } from '../../core/container';
import { Route } from '../../decorator/route';
import { IRoute } from '../../interface/route';
import { I18nService } from '../../service/i18n';

@Route()
export class ApiDoc implements IRoute {
    public name: string = '/api/doc';
    public methods: string[] = ['get'];
    public path: string = '/api/doc';

    private applicationConfig: ApplicationConfig;
    private i18n: I18nService;
    private swagger: any;

    public constructor(applicationConfig: ApplicationConfig, i18n: I18nService) {
        this.applicationConfig = applicationConfig;
        this.i18n = i18n;
    }

    public async handle(req: express.Request, res: express.Response): Promise<express.Response> {
        await this.generateDoc(res.locals.locale);

        return res.json(this.swagger);
    }

    private async generateDoc(locale: string): Promise<void> {
        if (undefined !== this.swagger) {
            return;
        }

        const routes = await Container.getRoutes();
        const baseUrl = url.parse(this.applicationConfig.baseUrl);

        let scheme = 'http';

        if (undefined !== baseUrl.protocol) {
            scheme = baseUrl.protocol.replace(':', '');
        }

        this.swagger = {
            basePath: '',
            consumes: ['application/json'],
            host: baseUrl.host,
            info: {
                title: this.i18n.translate(locale, 'application.title'),
                version: '1.0.0',
            },
            paths: {},
            produces: ['application/json'],
            schemes: [scheme],
            swagger: '2.0',
        };

        for (const [key, route] of Object.entries(routes)) {
            let options: any;

            for (const [property, value] of Object.entries(route)) {
                if (property === '__options') {
                    options = value;
                }
            }

            if (undefined === options || undefined === options.openapi) {
                continue;
            }

            for (const [optKey, opt] of Object.entries(options.openapi)) {
                if (undefined === options.openapi[optKey].summary) {
                    options.openapi[optKey].summary = route.path;
                }
            }

            this.swagger.paths[route.path] = options.openapi;
        }
    }
}
