export class Container {
    public static config: any[] = [];
    public static middleware: any[] = [];
    public static route: any[] = [];
    public static service: any[] = [];
    public static viewHelper: any[] = [];
    public static instances: { [key: string]: any } = {};

    public static get<T>(target: any): T {
        if (!this.isMerged) {
            this.mergeClasses();
        }

        let resolvedTarget = target;
        let i: number = 0;
        let key: number = -1;

        for (const option of [...this.config, ...this.middleware, ...this.route, ...this.service, ...this.viewHelper]) {
            if (target.isPrototypeOf(option) || target === option) {
                resolvedTarget = option;
                key = i;
            }

            i++;
        }

        if (-1 === key) {
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

        this.instances[key] = new resolvedTarget(...injections);

        return this.instances[key];
    }

    private static isMerged: boolean = false;

    private static mergeClasses() {
        let key = 0;

        for (const option of this.config) {
            for (const optionToCheck of this.config) {
                if (optionToCheck.isPrototypeOf(option)) {
                    delete this.config[key];
                }
            }
            key++;
        }

        for (const option of this.middleware) {
            for (const optionToCheck of this.middleware) {
                if (optionToCheck.isPrototypeOf(option)) {
                    delete this.middleware[key];
                }
            }
            key++;
        }

        for (const option of this.route) {
            for (const optionToCheck of this.route) {
                if (optionToCheck.isPrototypeOf(option)) {
                    delete this.route[key];
                }
            }
            key++;
        }

        for (const option of this.service) {
            for (const optionToCheck of this.service) {
                if (optionToCheck.isPrototypeOf(option)) {
                    delete this.service[key];
                }
            }
            key++;
        }

        for (const option of this.viewHelper) {
            for (const optionToCheck of this.viewHelper) {
                if (optionToCheck.isPrototypeOf(option)) {
                    delete this.viewHelper[key];
                }
            }
            key++;
        }
    }
}
