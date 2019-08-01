import express from 'express';
import ApplicationConfig from '../../config/application-config';
import HTTPServerConfig from '../../config/http-server-config';
import Container from '../../core/container';
import Route from '../../decorator/route';
import IRoute from '../../interface/route';
import I18nService from '../../service/i18n';

@Route()
export default class ApiDoc implements IRoute {
    public name: string = '/api/doc';
    public methods: string[] = ['get'];
    public path: string = '/api/doc';

    private applicationConfig: ApplicationConfig;
    private serverConfig: HTTPServerConfig;
    private i18n: I18nService;
    private openAPI: any;

    public constructor(applicationConfig: ApplicationConfig, serverConfig: HTTPServerConfig, i18n: I18nService) {
        this.applicationConfig = applicationConfig;
        this.serverConfig = serverConfig;
        this.i18n = i18n;
    }

    public async handle(req: express.Request, res: express.Response): Promise<express.Response> {
        await this.generateDoc(res.locals.locale);

        return res.json(this.openAPI);
    }

    private async generateDoc(locale: string): Promise<void> {
        if (undefined !== this.openAPI) {
            return;
        }

        const routes = await Container.getRoutes();

        this.openAPI = {
            components: {
                securitySchemes: {
                    bearerAuth: {
                        bearerFormat: 'JWT',
                        scheme: 'bearer',
                        type: 'http',
                    },
                },
            },
            info: {
                title: this.i18n.translate(locale, 'application.title'),
                version: this.applicationConfig.version,
            },
            openapi: '3.0.0',
            paths: {},
            servers: [{ url: this.serverConfig.baseUrl }],
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

            this.openAPI.paths[route.path] = options.openapi;
        }
    }
}
