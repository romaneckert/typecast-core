import 'reflect-metadata';

export default class ApplicationService {
    public static classes: [];

    public static async create<T>(target: any): Promise<T> {
        /*
        if (undefined === this.loggerClass) {
            this.loggerClass = (await import('../service/logger')).default;
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
        */

        const instances = [];
        const classParameters = Reflect.getMetadata('design:paramtypes', target) || [];

        for (const classParameter of classParameters) {
            instances.push(await this.create<any>(classParameter));
        }

        return new target(...instances);
    }

    private static instances: { [key: string]: any } = {};
}
