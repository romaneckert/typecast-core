import { IConfig } from '../interface/config';
import { IRoute } from '../interface/route';
import { IViewHelper } from '../interface/view-helper';

export class Container {
    public static classes: { [key: string]: any } = {};

    public static async get<T>(target: any, additionalKey: string = ''): Promise<T> {
        if (undefined === this.loggerClass) {
            this.loggerClass = (await import('../service/logger')).LoggerService;
        }

        let resolvedTarget;
        let resolvedNamespace;
        let i: number = 0;
        let key: string = '';

        for (const [namespace, classesOfNamespace] of Object.entries(this.classes)) {
            for (const option of classesOfNamespace) {
                if (target.isPrototypeOf(option) || target === option) {
                    resolvedTarget = option;
                    resolvedNamespace = namespace;
                    key = i + '_' + additionalKey;
                    break;
                }

                i++;
            }

            if (undefined !== resolvedTarget) {
                break;
            }
        }

        if (undefined === resolvedNamespace) {
            throw new Error(`can not find namespace ${resolvedNamespace}`);
        }

        if (undefined === this.instances[resolvedNamespace]) {
            this.instances[resolvedNamespace] = {};
        }

        if (undefined === resolvedTarget) {
            throw new Error(`can not find class`);
        }

        if (undefined !== this.instances[resolvedNamespace][key]) {
            return this.instances[resolvedNamespace][key];
        }

        const params = Reflect.getMetadata('design:paramtypes', resolvedTarget) || [];

        const injections = [];

        for (const param of params) {
            if (param.isPrototypeOf(this.loggerClass) || param === this.loggerClass) {
                const contextType = resolvedNamespace;
                const contextName = resolvedTarget.name
                    .replace('Service', '')
                    .replace('Route', '')
                    .replace('ViewHelper', '')
                    .replace('Middleware', '')
                    .toLowerCase();

                const loggerInstance = await Container.get<any>(param, contextType + '/' + contextName);
                loggerInstance.contextType = contextType;
                loggerInstance.contextName = contextName;

                injections.push(loggerInstance);
            } else {
                injections.push(await Container.get<any>(param));
            }
        }

        return (this.instances[resolvedNamespace][key] = new resolvedTarget(...injections));
    }

    public static async getConfigs(): Promise<{ [key: string]: IConfig }> {
        for (const option of this.classes.config) {
            await this.get(option);
        }

        return this.instances.config;
    }

    public static async getViewHelpers(): Promise<{ [key: string]: IViewHelper }> {
        for (const option of this.classes.viewHelper) {
            await this.get(option);
        }

        return this.instances.viewHelper;
    }

    public static async getRoutes(): Promise<{ [key: string]: IRoute }> {
        for (const option of this.classes.route) {
            await this.get(option);
        }

        return this.instances.route;
    }

    private static loggerClass: any;
    private static instances: { [key: string]: any } = {};
}
