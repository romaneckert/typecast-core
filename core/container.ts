import { IRoute } from '../interface/route';
import { IViewHelper } from '../interface/view-helper';

export default class Container {
    public static classes: { [key: string]: any } = {};

    public static async get<T>(target: any, additionalKey: string = ''): Promise<T> {
        if (undefined === this.loggerClass) {
            this.loggerClass = (await import('../service/logger')).LoggerService;
        }

        let resolvedOption;
        let resolvedNamespace;
        let i: number = 0;
        let key: string = '';

        for (const [namespace, classesOfNamespace] of Object.entries(this.classes)) {
            for (const option of classesOfNamespace) {
                if (target.isPrototypeOf(option.target) || target === option.target) {
                    resolvedOption = option;
                    resolvedNamespace = namespace;
                    key = i + '_' + additionalKey;
                    break;
                }

                i++;
            }

            if (undefined !== resolvedOption) {
                break;
            }
        }

        if (undefined === resolvedNamespace) {
            throw new Error(`can not find namespace ${resolvedNamespace}`);
        }

        if (undefined === this.instances[resolvedNamespace]) {
            this.instances[resolvedNamespace] = {};
        }

        if (undefined === resolvedOption) {
            throw new Error(`can not find class`);
        }

        if (undefined !== this.instances[resolvedNamespace][key]) {
            return this.instances[resolvedNamespace][key];
        }

        const params = Reflect.getMetadata('design:paramtypes', resolvedOption.target) || [];

        const injections = [];

        for (const param of params) {
            if (undefined === param) {
                console.log(resolvedOption.target);
            }

            if (param.isPrototypeOf(this.loggerClass) || param === this.loggerClass) {
                const contextType = resolvedNamespace;
                const contextName = resolvedOption.target.name
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

        const instance = new resolvedOption.target(...injections);
        instance.__options = resolvedOption.options;

        return (this.instances[resolvedNamespace][key] = instance);
    }

    public static async getConfigs(): Promise<{ [key: string]: any }> {
        for (const option of this.classes.config) {
            await this.get(option.target);
        }

        return this.instances.config;
    }

    public static async getViewHelpers(): Promise<{ [key: string]: IViewHelper }> {
        for (const option of this.classes.viewHelper) {
            await this.get(option.target);
        }

        return this.instances.viewHelper;
    }

    public static async getRoutes(): Promise<{ [key: string]: IRoute }> {
        for (const option of this.classes.route) {
            await this.get(option.target);
        }

        return this.instances.route;
    }

    private static loggerClass: any;
    private static instances: { [key: string]: any } = {};
}
