import { IRoute } from '../interface/route';

export class Container {
    public static classes: { [key: string]: any } = {};

    public static get<T>(target: any): T {
        let resolvedTarget;
        let resolvedNamespace;
        let i: number = 0;
        let key: number = -1;

        for (const [namespace, classesOfNamespace] of Object.entries(this.classes)) {
            for (const option of classesOfNamespace) {
                if (target.isPrototypeOf(option) || target === option) {
                    resolvedTarget = option;
                    resolvedNamespace = namespace;
                    key = i;
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

        if (undefined === resolvedTarget) {
            throw new Error(`can not find class`);
        }

        if (undefined !== this.instances[key]) {
            return this.instances[key];
        }

        const params = Reflect.getMetadata('design:paramtypes', resolvedTarget) || [];

        const injections = [];

        for (const param of params) {
            injections.push(Container.get<any>(param));
        }

        if (undefined === this.instances[resolvedNamespace]) {
            this.instances[resolvedNamespace] = {};
        }

        return (this.instances[resolvedNamespace][key] = new resolvedTarget(...injections));
    }

    public static get routes(): { [key: string]: IRoute } {
        for (const option of this.classes.route) {
            this.get(option);
        }

        return this.instances.route;
    }

    private static instances: { [key: string]: any } = {};
}
